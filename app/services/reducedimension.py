import pandas as pd
from sklearn.decomposition import PCA
import umap


def run_pca(df: pd.DataFrame, n_components=2):
    model = PCA(n_components=n_components)
    return model.fit_transform(df.values)


def run_umap(df: pd.DataFrame, n_components=2):
    model = umap.UMAP(n_components=n_components)
    return model.fit_transform(df.values)