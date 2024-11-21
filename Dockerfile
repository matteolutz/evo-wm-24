FROM node:22 AS base

# Install all node_modules, including dev dependencies
FROM base AS deps

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install --production=false

# Setup production node_modules
FROM base AS production-deps

ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json yarn.lock ./
RUN yarn install --production

# Build the app
FROM base AS build

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN yarn build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .

ARG PORT
ENV PORT $PORT

ARG SERIAL_PORT
ENV SERIAL_PORT $SERIAL_PORT

ARG DISABLE_SERIAL
ENV DISABLE_SERIAL $DISABLE_SERIAL

ARG MEDIA_BASE_DIR
ENV MEDIA_BASE_DIR $MEDIA_BASE_DIR

ARG DB_HOME
ENV DB_HOME $DB_HOME

CMD ["yarn", "start"]
