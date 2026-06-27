# Adjust this import based on where your FastAPI app is located
import pandas as pd
from fastapi.testclient import TestClient

from app.dataset_eda.dependencies import check_column_numberic, check_columns_exist
from app.dependencies.dataset_action import get_dataset
from app.main import app


# Mock the `get_dataset` dependency for testing purposes
def mock_get_dataset():
    return pd.DataFrame({"feature1": [1, 2, 3, 4, 100], "feature2": [5, 4, 3, 2, 1]})


# Mock `check_column_numberic` to directly return the column name
def mock_check_column_numberic(column_name: str):
    # Assuming the column exists and is numeric, simply return the column name
    return column_name


# Override dependencies for testing
app.dependency_overrides[get_dataset] = mock_get_dataset
app.dependency_overrides[check_column_numberic] = mock_check_column_numberic

# Create TestClient instance for synchronous testing
client = TestClient(app)


# Test the `/dataset/columns` endpoint
def test_get_columns():
    response = client.get("/dataset/columns")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    data = response.json()

    expected_columns = {
        "count": {"feature1": 5.0, "feature2": 5.0},
        "mean": {"feature1": 22.0, "feature2": 3.0},
        "std": {"feature1": 43.617656975128774, "feature2": 1.5811388300841898},
        "min": {"feature1": 1.0, "feature2": 1.0},
        "25%": {"feature1": 2.0, "feature2": 2.0},
        "50%": {"feature1": 3.0, "feature2": 3.0},
        "75%": {"feature1": 4.0, "feature2": 4.0},
        "max": {"feature1": 100.0, "feature2": 5.0},
    }

    # -------------------------
    # columns check
    # -------------------------
    actual_columns = data.get("columns")
    assert actual_columns == expected_columns, (
        f"Expected columns {expected_columns}, got {actual_columns}"
    )

    # -------------------------
    # shape check
    # -------------------------
    expected_shape = [5, 2]
    actual_shape = data.get("shape")
    assert actual_shape == expected_shape, (
        f"Expected shape {expected_shape}, got {actual_shape}"
    )

    # -------------------------
    # head check (UPDATED)
    # -------------------------
    expected_head_rows = [
        {"feature1": 1, "feature2": 5},
        {"feature1": 2, "feature2": 4},
        {"feature1": 3, "feature2": 3},
        {"feature1": 4, "feature2": 2},
        {"feature1": 100, "feature2": 1},
    ]

    actual_head_rows = data.get("head", {}).get("rows")

    assert actual_head_rows == expected_head_rows, (
        f"Expected head rows {expected_head_rows}, got {actual_head_rows}"
    )


# Test the `/dataset/columns/{column_name}/histogram` endpoint
def test_get_column_histogram():
    response = client.get("/dataset/columns/feature1/histogram?bins=2")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    data = response.json()

    # Column name check
    expected_column = "feature1"
    assert data["column"] == expected_column, (
        f"Expected column '{expected_column}', got '{data['column']}'"
    )

    # Bin count check
    expected_bins = 2
    assert data["bins"] == expected_bins, (
        f"Expected bins {expected_bins}, got {data['bins']}"
    )

    # Histogram length
    assert len(data["histogram"]) == expected_bins, (
        f"Expected {expected_bins} bins, got {len(data['histogram'])}"
    )

    # Check counts sum
    total_count = sum(bin["count"] for bin in data["histogram"])
    expected_count = 5  # We have 5 rows in mock dataset
    assert total_count == expected_count, (
        f"Total histogram count mismatch: expected {expected_count}, got {total_count}"
    )

    # Check bin structure
    for i, bin in enumerate(data["histogram"]):
        assert "bin_start" in bin and "bin_end" in bin and "count" in bin, (
            f"Bin {i} missing required keys"
        )


# Test for the boxplot statistics endpoint
def test_boxplot_statistics():
    expected_column = "feature1"
    # Test for feature1
    response = client.get("/dataset/columns/feature1/boxplot")

    # Assert the status code is 200 (success)
    assert response.status_code == 200

    # Assert the returned data contains the expected statistics
    data = response.json()

    # Check if the correct column name is returned
    assert data["column"] == expected_column, (
        f"Expected column '{expected_column}', got '{data['column']}'"
    )

    # Check if boxplot statistics are included in the response
    assert "min" in data, "Missing 'min' value in response"
    assert "q1" in data, "Missing 'q1' value in response"
    assert "median" in data, "Missing 'median' value in response"
    assert "q3" in data, "Missing 'q3' value in response"
    assert "max" in data, "Missing 'max' value in response"

    # Check if outliers are included in the response
    assert "outliers" in data, "Missing 'outliers' key in response"
    assert isinstance(data["outliers"], list), (
        f"Expected 'outliers' to be a list, but got {type(data['outliers'])}"
    )
    assert len(data["outliers"]) == 1, (
        f"Expected 1 outlier, but got {len(data['outliers'])} outliers"
    )

    # Test the expected outlier value (100 is the outlier in our mock data)
    assert data["outliers"] == [100], (
        f"Expected outlier values to be [100], but got {data['outliers']}"
    )


def mock_get_dataset():
    return pd.DataFrame(
        {
            "age": [20, 25, 30, 35, 40],
            "salary": [3000, 4000, 5000, 6000, 7000],
            "city": ["HCM", "HN", "HCM", "HN", "HCM"],
        }
    )


# Assume df has columns: "age", "salary", "city"
def test_filters_basic():
    app.dependency_overrides[get_dataset] = mock_get_dataset
    response = client.get("/dataset/filters?min_age=31")
    assert response.status_code == 200

    data = response.json()

    assert isinstance(data["rows"], list)
    assert isinstance(data["count"], int)

    assert all(row["age"] >= 31 for row in data["rows"])


def test_filters_limit_offset():
    response = client.get("/dataset/filters?min_age=25&limit=2&offset=1")
    assert response.status_code == 200

    data = response.json()
    rows = data["rows"]

    assert len(rows) == 2

    assert rows[0]["age"] == 30
    assert rows[1]["age"] == 35


def test_filters_multiple_conditions():
    response = client.get("/dataset/filters?min_age=25&city=HCM")
    assert response.status_code == 200

    data = response.json()
    rows = data["rows"]

    assert all(row["age"] >= 25 and row["city"] == "HCM" for row in rows)


def test_filters_empty_result():
    response = client.get("/dataset/filters?max_age=10")
    assert response.status_code == 200

    data = response.json()

    assert data["rows"] == []
    assert data["count"] == 0


def test_filters_output_format():
    response = client.get("/dataset/filters?min_age=25")
    data = response.json()
    rows = data["rows"]

    assert all(isinstance(row, dict) for row in rows)
    assert all(key in row for row in rows for key in ["age", "salary", "city"])


def test_get_duplicates_basic():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, 2, 3, 4, 4, 4],
            "feature2": [10, 20, 20, 30, 40, 40, 40],
            "age": [25, 30, 30, 35, 40, 40, 40],
            "city": ["HCM", "HN", "HN", "DN", "HP", "HP", "HP"],
        }

        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/duplicates")
    assert response.status_code == 200

    data = response.json()

    assert "rows" in data
    assert "count" in data

    assert isinstance(data["rows"], list)
    assert isinstance(data["count"], int)

    # sanity check: duplicates should exist
    assert data["count"] == 5


def test_get_duplicates_subset():

    response = client.get("/dataset/duplicates?subset=feature1&subset=feature2")
    assert response.status_code == 200

    data = response.json()
    rows = data["rows"]

    # ensure all rows exist
    for row in rows:
        assert "feature1" in row
        assert "feature2" in row


def test_get_duplicates_keep_false():

    response = client.get("/dataset/duplicates?keep=false")
    assert response.status_code == 200, (
        f"\nStatus: {response.status_code}\nDetail: {response.json()}"
    )

    data = response.json()
    rows = data["rows"]

    # all duplicate rows should be returned
    assert isinstance(rows, list)


def test_get_duplicates_keep_first():

    response = client.get("/dataset/duplicates?keep=first")
    assert response.status_code == 200

    data = response.json()

    assert isinstance(data["rows"], list)


def test_get_duplicates_empty():
    def mock_get_dataset_no_duplicates():
        data = {
            "feature1": [1, 2, 3, 4, 5],
            "feature2": [10, 20, 30, 40, 50],
            "age": [25, 30, 35, 40, 45],
            "city": ["HCM", "HN", "DN", "HP", "CT"],
        }

        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset_no_duplicates

    response = client.get("/dataset/duplicates")
    assert response.status_code == 200

    data = response.json()

    assert data["rows"] == []
    assert data["count"] == 0


def test_duplicates_logic():
    response = client.get("/dataset/duplicates")
    data = response.json()
    rows = data["rows"]

    # every row should appear more than once in dataset
    df_rows = pd.DataFrame(rows)

    assert len(df_rows) == data["count"]


def test_get_missing_basic():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, None, 3, 4, None],
            "feature2": [10, None, 20, 30, None, 40],
            "age": [25, 30, 30, None, 40, 40],
            "city": ["HCM", "HN", None, "DN", "HP", "HP"],
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/missing")
    assert response.status_code == 200

    data = response.json()

    assert "rows" in data
    assert "count" in data

    assert isinstance(data["rows"], list)
    assert isinstance(data["count"], int)

    # sanity check: missing values should exist
    assert data["count"] > 0


def test_get_missing_subset():
    response = client.get("/dataset/missing?subset=feature1&subset=feature2")
    assert response.status_code == 200

    data = response.json()
    rows = data["rows"]

    for row in rows:
        # at least one of subset columns must be None
        assert row["feature1"] is None or row["feature2"] is None


def test_get_missing_pagination():
    response = client.get("/dataset/missing?limit=2&offset=1")
    assert response.status_code == 200

    data = response.json()

    assert len(data["rows"]) <= 2


def test_get_missing_empty():
    def mock_get_dataset_no_missing():
        data = {
            "feature1": [1, 2, 3, 4, 5],
            "feature2": [10, 20, 30, 40, 50],
            "age": [25, 30, 35, 40, 45],
            "city": ["HCM", "HN", "DN", "HP", "CT"],
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset_no_missing

    response = client.get("/dataset/missing")
    assert response.status_code == 200

    data = response.json()

    assert data["rows"] == []
    assert data["count"] == 0


def test_missing_logic():
    response = client.get("/dataset/missing")
    data = response.json()
    rows = data["rows"]

    df_rows = pd.DataFrame(rows)

    # every row should contain at least one missing value
    assert df_rows.isna().any(axis=1).all()

    assert len(df_rows) == data["count"]


def test_get_pca_success():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, 3, 4, 5],
            "feature2": [10, 20, 30, 40, 50],
            "feature3": [5, 4, 3, 2, 1],
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/pca")
    assert response.status_code == 200, f"{response.json()}"

    data = response.json()

    # structure checks
    assert "points" in data
    assert "explained_variance" in data
    assert "total_variance" in data

    # PCA should return same number of rows
    assert len(data["points"]) == 5

    # each point has pc1, pc2
    for point in data["points"]:
        assert "pc1" in point
        assert "pc2" in point

    # explained variance should have 2 components
    assert len(data["explained_variance"]) == 2

    # total variance should be sum
    assert abs(sum(data["explained_variance"]) - data["total_variance"]) < 1e-6


def test_pca_ignores_non_numeric():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, 3, 4, 5],
            "feature2": [10, 20, 30, 40, 50],
            "city": ["HCM", "HN", "DN", "HP", "CT"],  # should be ignored
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/pca")
    assert response.status_code == 200

    data = response.json()

    # still works with numeric subset
    assert len(data["points"]) == 5


def test_pca_drops_nan():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, None, 4, 5],
            "feature2": [10, 20, 30, None, 50],
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/pca")
    assert response.status_code == 200

    data = response.json()

    # rows with NaN should be dropped → only rows without NaN remain
    assert len(data["points"]) == 3


def test_pca_not_enough_features():
    def mock_get_dataset():
        data = {
            "feature1": [1, 2, 3, 4, 5],  # only 1 column
        }
        return pd.DataFrame(data)

    app.dependency_overrides[get_dataset] = mock_get_dataset

    response = client.get("/dataset/pca")

    # depends on your error handling
    assert response.status_code in (400, 422, 500)


def test_scatterplot_basic():
    def mock_get_dataset():
        return pd.DataFrame(
            {
                "a": [1, 2, 3, 4],
                "b": [10, 20, 30, 40],
                "c": [100, 200, 300, 400],
            }
        )

    def mock_check_columns_exist():
        return ["a", "b"]

    app.dependency_overrides[get_dataset] = mock_get_dataset
    app.dependency_overrides[check_columns_exist] = mock_check_columns_exist

    response = client.get("/dataset/scatterplot?limit=2&offset=1")

    assert response.status_code == 200, f"{response.json()}"
    data = response.json()

    # structure
    assert "rows" in data
    assert "count" in data

    # pagination applied: offset=1, limit=2 → rows index 1,2
    assert data["count"] == 2
    assert len(data["rows"]) == 2

    # only selected columns
    for row in data["rows"]:
        assert set(row.keys()) == {"a", "b"}


def test_scatterplot_pagination():
    def mock_get_dataset():
        return pd.DataFrame(
            {
                "a": [1, 2, 3, 4, 5],
                "b": [10, 20, 30, 40, 50],
            }
        )

    def mock_check_columns_exist():
        return ["a", "b"]

    app.dependency_overrides[get_dataset] = mock_get_dataset
    app.dependency_overrides[check_columns_exist] = mock_check_columns_exist

    response = client.get("/dataset/scatterplot?limit=3&offset=2")

    data = response.json()

    assert data["count"] == 3


def test_kdeplot_basic():
    # Mock dependencies
    def mock_get_dataset():
        return pd.DataFrame({"value": [1, 2, 3, 4, 5]})

    def mock_check_column_numeric():
        return "value"

    app.dependency_overrides[get_dataset] = mock_get_dataset
    app.dependency_overrides[check_column_numberic] = mock_check_column_numeric

    # Call API
    response = client.get("/dataset/kdeplot")

    # Assertions
    assert response.status_code == 200

    data = response.json()

    assert "points" in data
    assert len(data["points"]) == 200

    # Check structure
    first_point = data["points"][0]
    assert "x" in first_point
    assert "y" in first_point

    assert isinstance(first_point["x"], float)
    assert isinstance(first_point["y"], float)


def test_kdeplot_different_data():
    def mock_get_dataset():
        return pd.DataFrame({"value": [10, 20, 30, 40, 50]})

    def mock_check_column_numeric():
        return "value"

    app.dependency_overrides[get_dataset] = mock_get_dataset
    app.dependency_overrides[check_column_numberic] = mock_check_column_numeric

    response = client.get("/dataset/kdeplot")
    data = response.json()

    assert len(data["points"]) == 200

    # Ensure values are not all zero
    ys = [p["y"] for p in data["points"]]
    assert any(y > 0 for y in ys)
