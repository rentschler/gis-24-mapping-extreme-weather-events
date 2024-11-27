import sqlite3
import csv
import pandas as pd
from sqlalchemy import create_engine


def preprocess():
    raw_df = pd.read_csv("raw.csv")

    # Step 1: Drop columns with all NaN values
    raw_df = raw_df.dropna(axis=1, how='all')

    # Step 1: Replace all double quotes (") with single quotes (')
    raw_df = raw_df.applymap(lambda x: x.replace(',', ";") if isinstance(x, str) else x)


    # Step 2: Fill NaN values with empty strings
    raw_df = raw_df.fillna("NA")

    raw_df.to_csv('data.csv',index=False,header=True, quoting=csv.QUOTE_NONE)