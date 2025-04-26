# Data Generator Service

A Kafka-based event streaming service that generates simulated cryptocurrency transaction data for the event streaming pipeline.

## Overview

This service continuously generates fake cryptocurrency transaction events and publishes them to a Kafka topic. It's part of a larger event streaming architecture that includes:
- API service for event ingestion
- Kafka message broker
- Consumer service for event processing
- MongoDB for storage

## Features

- Generates realistic crypto transaction data using Faker.js
- Configurable event generation intervals (500-2000ms)
- Kafka integration for event streaming
- Four event types: `buy`, `sell`, `trade`, `transfer`
- Includes metadata:
  - Cryptocurrency amounts
  - Wallet addresses
  - Currency types
  - Timestamps

## Prerequisites

- Node.js 18+
- npm 9+
- Docker 20.10+
- Docker Compose 2.20+
- Kafka broker (included in Docker setup)
- MongoDB (included in Docker setup)
