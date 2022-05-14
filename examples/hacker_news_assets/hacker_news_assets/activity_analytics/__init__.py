import json
import os

from dagster_dbt.asset_defs import load_assets_from_dbt_manifest
from hacker_news_assets.sensors.hn_tables_updated_sensor import make_hn_tables_updated_sensor

from dagster import assets_from_package_module
from dagster.utils import file_relative_path

from . import assets

DBT_PROJECT_DIR = file_relative_path(__file__, "hacker_news_dbt")
DBT_PROFILES_DIR = DBT_PROJECT_DIR + "/config"

dbt_assets = load_assets_from_dbt_manifest(
    json.load(open(os.path.join(DBT_PROJECT_DIR, "target", "manifest.json"), encoding="utf-8")),
    io_manager_key="warehouse_io_manager",
)

activity_analytics_assets = (
    assets_from_package_module(package_module=assets).prefixed("activity_analytics") + dbt_assets
)


activity_analytics_assets_sensor = make_hn_tables_updated_sensor(
    activity_analytics_assets.build_job(name="story_activity_analytics_job")
)

activity_analytics_definitions = [
    activity_analytics_assets,
    activity_analytics_assets_sensor,
]
