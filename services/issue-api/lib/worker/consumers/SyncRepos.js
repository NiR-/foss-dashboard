export default async function consume ({logger, publisher}, channel, msg) {
  try {
    const {org, repos} = JSON.parse(msg.content.toString());

    repos.map((repo) => publisher.publish('issue.sync_repo', {org, repo}));
  } catch (err) {
    logger.error(err);
    channel.nack(msg);
    return;
  }

  channel.ack(msg);
}
