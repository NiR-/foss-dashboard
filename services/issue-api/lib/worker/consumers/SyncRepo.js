import {SyncIssues} from '../../domain';

export default async function consume ({logger, container}, channel, msg) {
  try {
    const {repo} = JSON.parse(msg.content.toString());
    await SyncIssues.handle(container, {repo});
  } catch (err) {
    logger.error(err);
    channel.nack(msg, false, false);
    return;
  }

  channel.ack(msg);
}
