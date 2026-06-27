from typing import Any, Dict, Hashable


def turn_key_to_string(df: Dict[Hashable, Any]) -> Dict[str, Any]:
    r_dict = {}
    for k, v in df.items():
        if isinstance(v, Dict):
            v = turn_key_to_string(v)
        r_dict[str(k)] = v
    return r_dict
