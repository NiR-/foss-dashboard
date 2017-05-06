import amqp from './amqp';
import logger from './logger';

export async function publish (eventName, payload) {
  logger.debug(`Publishing event "${eventName}".`);

  const exchange = await amqp.exchange('amq.direct');
  exchange.publish(eventName, payload, {contentType: 'application/json'});

  logger.debug(`Event "${eventName}" published.`);
}
