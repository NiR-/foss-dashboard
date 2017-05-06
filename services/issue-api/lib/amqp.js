export class EventPublisher {
  constructor ({channel}, exchange, persistent = true) {
    this._channel = channel;
    this._exchange = exchange;
    this._persistent = persistent;
  }

  async publish (event, message) {
    const content = new Buffer(JSON.stringify(message));

    this._channel.publish(this._exchange, event, content, {persistent: this._persistent});
  }
}

export class EventSubscriber {
  constructor ({channel, logger}, exchange, queue, pattern, prefetch = 1) {
    this._channel = channel;
    this._logger = logger;
    this._exchange = exchange;
    this._queue = queue;
    this._pattern = pattern;
    this._prefetch = prefetch;
  }

  async subscribe (handler) {
    this._channel.prefetch(this._prefetch);
    this._channel.assertQueue(this._queue, {durable: true});
    this._channel.bindQueue(this._queue, this._exchange, this._pattern);
    this._logger.info(`Bound queue "${this._queue}" to "${this._pattern}" on exchange "${this._exchange}". Start consuming.`);

    this._channel.consume(this._queue, (msg) => {
      this._logger.info(`New event received on queue "${this._queue}".`);
      handler(this._channel, msg);
    });
  }
}
