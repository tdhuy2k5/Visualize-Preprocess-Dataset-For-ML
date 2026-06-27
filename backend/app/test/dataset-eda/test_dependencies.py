import pytest
import pandas as pd
from fastapi import HTTPException
from app.dataset_eda.dependencies import build_query  # adjust import

# Sample DataFrame for testing
df = pd.DataFrame(
    {"age": [25, 30, 35], "salary": [4000, 5000, 6000], "city": ["HCM", "HCM", "HN"]}
)


# Helper to create a mock Request
class MockRequest:
    def __init__(self, query_params: dict):
        # Convert to list of tuples, mimicking request.query_params.items()
        self._params = query_params

    @property
    def query_params(self):
        # Return object that has .items() method
        class QueryParams:
            def __init__(self, params):
                self._params = params

            def items(self):
                return self._params.items()

        return QueryParams(self._params)


def test_build_query_basic():
    request = MockRequest({"age": "30", "city": "HCM"})
    query_str = build_query(request, df)  # type: ignore
    expected = 'age == 30 and city == "HCM"'
    assert query_str == 'age == 30 and city == "HCM"', (
        f"Expected column '{expected}', got '{query_str}'"
    )


def test_build_query_min_max_not():
    request = MockRequest({"min_age": "26", "max_salary": "5000", "not_city": "HN"})
    query_str = build_query(request, df)  # type: ignore
    expected = 'age >= 26 and salary <= 5000 and city != "HN"'
    assert query_str == expected, f"Expected column '{expected}', got '{query_str}'"


def test_build_query_invalid_column():
    request = MockRequest({"nonexistent": "10"})
    with pytest.raises(HTTPException) as exc:
        build_query(request, df)  # type: ignore
    assert exc.value.status_code == 400
    assert "Column not found" in exc.value.detail


def test_build_query_invalid_filter_param():
    request = MockRequest({"age__gt": "30"})  # double underscore not allowed
    with pytest.raises(HTTPException) as exc:
        build_query(request, df)  # type: ignore
    assert exc.value.status_code == 400
    assert "Invalid filter param" in exc.value.detail


def test_build_query_no_filters():
    request = MockRequest({})
    query_str = build_query(request, df)  # type: ignore
    assert query_str == ""
