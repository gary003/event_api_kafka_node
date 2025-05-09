# Data Generator Service

A Kafka-based event streaming service that generates simulated transaction data for the event streaming pipeline.

## Overview

This service continuously generates fake transaction events and publishes them to a Kafka topic. It's part of a larger event streaming architecture that includes:
- API service for event ingestion
- Kafka message broker
- Consumer service for event processing

## Features

- Configurable event generation intervals (500-2000ms)
- Kafka integration for event streaming
- Two event types: `Countries`, `Astronomy`
- Includes metadata:
  - amount of stars and types

## Prerequisites

- Node.js 18+
- npm 9+
- Docker 20.10+
- Docker Compose 2.20+
- Kafka broker (included in Docker setup)
