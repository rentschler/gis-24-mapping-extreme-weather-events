from typing import Annotated, TypeAlias

from pydantic import BeforeValidator


def _empty_str_to_none(value: str | None) -> None:
    if value == "":
        return None

    return value


EmptyStrToNone: TypeAlias = Annotated[None, BeforeValidator(_empty_str_to_none)]
