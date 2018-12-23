FROM       node:alpine

COPY        . /app
WORKDIR     /app
RUN         npm install
RUN ls
RUN ls src

ENTRYPOINT ["node", "/app/src/App.js"]
