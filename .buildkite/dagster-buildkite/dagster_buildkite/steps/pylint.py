from typing import Optional

from ..defines import SupportedPython
from ..step_builder import CommandStep, StepBuilder


def build_pylint_step(root_dir: str, base_label: Optional[str] = None) -> CommandStep:
    return (
        StepBuilder(f":lint-roller: {base_label}")
        .run(
            "pip install -U virtualenv",
            f"cd {root_dir}",
            "tox -vv -e pylint",
        )
        .on_integration_image(SupportedPython.V3_8)
        .build()
    )
