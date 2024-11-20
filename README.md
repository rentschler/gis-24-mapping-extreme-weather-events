# Geographic Information Systems

Welcome to your project template! This template includes several fixes based on your suggestions, compared to the setup provided for the exercises in the tutorial. As before, you can start the project by running `docker compose up` in the project's root directory in your terminal.

You may experience a delay in the backend startup until the database initialization is complete, as data import is now included in this process. To minimize this delay, adjust the value of the key `services.database.healthcheck.timeout` in `docker-compose.yaml`. A manual data import is no longer necessary unless desired.