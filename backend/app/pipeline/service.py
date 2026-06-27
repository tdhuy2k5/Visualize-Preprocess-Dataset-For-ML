from app.feature_imbalance.service import handle_imbalanced
from app.feature_imbalance.schemas import ImbalancedRequest
from app.pipeline.schemas import StepType
from app.feature_engineering.services.exp_eval import ExpressionEvaluator
from app.feature_engineering.services import sp_ops
from app.feature_engineering.schemas import FeatureEngRequest
from app.feature_transformation.schemas import TransformRequest
import json
from app.feature_encoding.schemas import EncodingRequest
from pathlib import Path
import pandas as pd
import app.feature_encoding.service as encoding
import app.feature_transformation.service as transformation

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = (BASE_DIR / "../../cached").resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_pipeline_path(dataset_id: str) -> Path:
    return UPLOAD_DIR / f"{dataset_id}_pipeline.json"


def load_pipeline(dataset_id: str) -> list[StepType]:
    path = get_pipeline_path(dataset_id)
    if not path.exists():
        return []
    steps: list[StepType] = [
        StepType.model_validate(step) for step in json.loads(path.read_text())
    ]

    return steps


def save_pipeline(dataset_id: str, steps: list[StepType]):
    path = get_pipeline_path(dataset_id)
    path.write_text(json.dumps([s.model_dump() for s in steps]))


def apply_pipeline(df: pd.DataFrame, steps: list[StepType]) -> pd.DataFrame:
    for step in steps:
        data = step.data
        if isinstance(data, TransformRequest):
            if data.method == "minmax":
                df = transformation.minmax_scale(df, data.columns)

            elif data.method == "standard":
                df = transformation.standard_scale(df, data.columns)

            elif data.method == "robust":
                df = transformation.robust_scale(df, data.columns)

            elif data.method == "power":
                df = transformation.power_transform(df, data.columns)

            elif data.method == "normalize":
                df = transformation.normalize(df, data.columns)

        elif isinstance(data, EncodingRequest):
            if data.method == "one_hot":
                df = encoding.one_hot(df, data.column)

            elif data.method == "label":
                df = encoding.label_encode(df, data.column)

            elif data.method == "target":
                df = encoding.target_encode(df, data.column, data.target)

            elif data.method == "count":
                df = encoding.count_encode(df, data.column)

            elif data.method == "freq":
                df = encoding.freq_encode(df, data.column)

            elif data.method == "binary":
                df = encoding.binary_encode(df, data.column)

            elif data.method == "ordinal":
                df = encoding.ordinal_encode(df, data.column, data.mapping)
            elif data.method == "log":
                df = transformation.log_transform(df, data.columns)
            elif data.method == "sqrt":
                df = transformation.sqrt_transform(df, data.columns)

        elif isinstance(data, FeatureEngRequest):
            op = data.operation
            if op == "extract_datetime":
                df = sp_ops.extract_datetime(df, data.column)
            elif op == "text_length":
                df = sp_ops.text_length(df, data.column, data.new_col)
            elif op == "word_count":
                df = sp_ops.word_count(df, data.column, data.new_col)
            elif op == "text_sentiment":
                df = sp_ops.text_sentiment(df, data.column, data.new_col)
            elif op == "flag_missing":
                df = sp_ops.flag_missing(df, data.column, data.new_col)
            elif op == "groupby_agg":
                df = sp_ops.groupby_agg(
                    df,
                    data.params["group_col"],
                    data.params["agg_col"],
                    data.new_col,
                    data.params.get("agg_func", "mean"),
                )
            elif op == "expression":
                # Use exp_eval for expression-based feature creation
                expression = data.params.get("expression", "")
                new_col = data.new_col or "new_feature"
                ExpressionEvaluator().exp_compiler(df, expression, new_col)
            else:
                raise ValueError("Unsupported operation")
        elif isinstance(data, ImbalancedRequest):
            df = handle_imbalanced(df, data.target, data.method)

        else:
            raise ValueError(f"Unsupported method: {type(step)}")

    return df
