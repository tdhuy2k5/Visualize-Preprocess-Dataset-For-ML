from app.dataset_chart.schemas import ScatterPlotResponse
from typing import List

import numpy as np
import pandas as pd
from scipy.stats._kde import gaussian_kde
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN

from .schemas import (
    BoxPlotResponse,
    HeatmapResponse,
    HistogramResponse,
    KDEResponse,
    PCAResponse,
)


def get_column_histogram(
    column_name: str,
    bins: int,
    df: pd.DataFrame,
) -> HistogramResponse:
    """
    Get the histogram statistics for a given column in the dataset.

    Args:
        column_name (str): The name of the column to compute the histogram for.
        bins (int): The number of bins to use for the histogram.
        df (pd.DataFrame): The pandas DataFrame containing the data.

    Returns:
        dict: A dictionary containing the column name, number of bins, and the histogram.
            The histogram is a list of dicts with 'bin_start', 'bin_end', and 'count' for each bin.
    """
    # Compute histogram using numpy
    col_data = df[column_name].dropna().to_numpy()
    counts, bin_edges = np.histogram(col_data, bins=bins)

    # Prepare the histogram data as a list of dicts
    histogram = [
        {
            "bin_start": float(bin_edges[i]),
            "bin_end": float(bin_edges[i + 1]),
            "count": int(counts[i]),
        }
        for i in range(len(counts))
    ]

    return HistogramResponse(
        column=column_name,
        bins=bins,
        histogram=histogram,
    )


def get_boxplot_statistics(
    column_name: str,
    df: pd.DataFrame,
) -> BoxPlotResponse:
    """
    Retrieve boxplot statistics for a specific column in a DataFrame and identify outliers.

    Args:
        column_name (str): The name of the column in the DataFrame to calculate statistics for.
        df (pd.DataFrame): The pandas DataFrame containing the data.

    Returns:
        dict: A dictionary containing boxplot statistics (min, q1, median, q3, max, outliers, etc.).
    """

    # Get the data for the column
    col_data: pd.Series = df[column_name]

    # Calculate the box plot statistics and convert to native types
    min_val: float | int = col_data.min()
    q1: float | int = col_data.quantile(0.25)
    median: float | int = col_data.median()
    q3: float | int = col_data.quantile(0.75)
    max_val: float | int = col_data.max()

    # Calculate IQR (Interquartile Range)
    iqr: float = q3 - q1

    # Calculate lower and upper bounds for outliers
    lower_bound: float | int = q1 - 1.5 * iqr
    upper_bound: float | int = q3 + 1.5 * iqr

    # Identify outliers (values outside the whiskers)
    outliers: pd.Series = col_data[(col_data < lower_bound) | (col_data > upper_bound)]

    # Ensure that outliers is always a list (even if there are no outliers)
    outliers_list: List[float | int] = (
        outliers.tolist()
    )  # Convert the Series of outliers to a list

    # Return only outliers, along with the stats to draw the box plot
    return BoxPlotResponse(
        column=column_name,
        min=min_val,
        q1=q1,
        median=median,
        q3=q3,
        max=max_val,
        outliers=outliers_list,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )


def get_scatterplot(
    df: pd.DataFrame, subset, limit: int = 100, offset: int = 0
) -> ScatterPlotResponse:
    sliced = df[subset].iloc[offset : offset + limit]

    # Validate all columns are numeric
    non_numeric = [
        col for col in sliced.columns if not pd.api.types.is_numeric_dtype(sliced[col])
    ]
    if non_numeric:
        raise ValueError(f"Non-numeric columns found: {non_numeric}")

    points = sliced.astype(float).values.tolist()
    return ScatterPlotResponse(points=points)


def get_KDEplot(df: pd.DataFrame, column_name: str) -> KDEResponse:
    att: pd.Series = df[column_name]
    kde = gaussian_kde(att)
    x_vals = np.linspace(att.min(), att.max(), 200).round(2)
    y_vals = kde(x_vals).round(2)
    points = [[float(x), float(y)] for x, y in zip(x_vals, y_vals)]
    return KDEResponse(points=points)


def get_heatmap(df: pd.DataFrame, subset: List[str]) -> HeatmapResponse:
    df = df[subset]
    corr_matrix = df.corr(numeric_only=True)

    return HeatmapResponse(
        labels=corr_matrix.columns.tolist(), matrix=corr_matrix.values.tolist()
    )


def get_pca_chart(df: pd.DataFrame) -> PCAResponse:
    """
    Compute PCA projection for a DataFrame and return 2D coordinates
    along with explained variance statistics.

    Args:
        df: Input DataFrame containing numeric columns only.
            Non-numeric columns are automatically ignored.

    Returns:
        PCAResponse containing:
            - points: List of PCA-transformed coordinates.
                Each point represents one row from the original dataset:
                    - pc1: Value along the first principal component
                    - pc2: Value along the second principal component

            - explained_variance: List of variance ratios explained by each component.
                Example: [0.65, 0.25] means:
                    - PC1 explains 65% of variance
                    - PC2 explains 25% of variance

            - total_variance: Sum of explained variance of selected components.
                Indicates how much information is preserved in the 2D projection.
    """
    # Ensure only numeric data is used
    numeric_df = df.select_dtypes(include="number").dropna()
    if numeric_df.shape[1] < 2:
        raise ValueError("Need at least 2 numeric columns for PCA")

    # Fit PCA with 2 components
    pca = PCA(n_components=2)
    points = pca.fit_transform(numeric_df).round(2)
    cluster = DBSCAN(eps=0.5, min_samples=5).fit_predict(points)
    points = [[point[0], point[1], cluster[i]] for i, point in enumerate(points)]

    # Explained variance metrics
    explained_variance: List = pca.explained_variance_ratio_.tolist()

    return PCAResponse(
        points=points,
        explained_variance=explained_variance,
        total_variance=sum(explained_variance),
    )
