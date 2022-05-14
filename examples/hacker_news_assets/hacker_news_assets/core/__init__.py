from dagster import assets_from_package_module, build_assets_job, schedule_from_partitions

from . import assets

core_assets = assets_from_package_module(package_module=assets).prefixed("core")

RUN_TAGS = {
    "dagster-k8s/config": {
        "container_config": {
            "resources": {
                "requests": {"cpu": "500m", "memory": "2Gi"},
            }
        },
    }
}

core_assets_schedule = schedule_from_partitions(
    build_assets_job(core_assets, name="core_job", tags=RUN_TAGS)
)


core_definitions = [core_assets, core_assets_schedule]
