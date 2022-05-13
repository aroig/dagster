from typing import List

from .mypy import make_mypy_step
from .pylint import make_pylint_step
from ..defines import SupportedPython
from ..step_builder import StepBuilder
from ..utils import CommandStep


def build_docs_steps() -> List[CommandStep]:
    return [

        # If this test is failing, it's because you may have either:
        #   (1) Updated the code that is referenced by a literalinclude in the documentation
        #   (2) Directly modified the inline snapshot of a literalinclude instead of updating
        #       the underlying code that the literalinclude is pointing to.
        # To fix this, run 'make snapshot' in the /docs directory to update the snapshots.
        # Be sure to check the diff to make sure the literalincludes are as you expect them."
        StepBuilder("docs code snapshots")
        .run("pushd docs; make docs_dev_install; make snapshot", "git diff --exit-code")
        .on_integration_image(SupportedPython.V3_7)
        .build(),

        # Make sure the docs site can build end-to-end.
        StepBuilder("docs next")
        .run(
            "pushd docs/next",
            "yarn",
            "yarn test",
            "yarn build-master",
        )
        .on_integration_image(SupportedPython.V3_7)
        .build(),

        StepBuilder("docs sphinx json build")
        .run(
            "pip install -U virtualenv",
            "cd docs",
            "tox -vv -e py38-sphinx",
        )
        .on_integration_image(SupportedPython.V3_8)
        .build(),

        StepBuilder("docs screenshot spec")
        .run("python docs/screenshot_capture/match_screenshots.py")
        .on_integration_image(SupportedPython.V3_8)
        .build(),

        make_mypy_step("docs"),
        make_pylint_step("docs"),
    ]
