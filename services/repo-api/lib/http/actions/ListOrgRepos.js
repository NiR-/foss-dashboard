import {commands, handleCommand} from '../../domain';
import _ from 'underscore';

/**
 * @api {get} /repos/:org List repositories of an organization
 * @apiName ListOrgRepos
 * @apiGroup repo-api
 * @apiVersion 0.1.0
 * @apiParam {String} org Organization name on Github
 * @apiExample {curl} Example usage:
 *     curl -s http://localhost/repo/KnpLabs | jq
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       "KnpLabs/dmFloodControlPlugin",
 *       "KnpLabs/knpDoctrineVersionPlugin",
 *       "KnpLabs/knpDeployPlugin",
 *       "KnpLabs/KnpUserBundle",
 *       "KnpLabs/KnpMarkdownBundle",
 *       "KnpLabs/knpLocaleAwareNumberPlugin",
 *       "KnpLabs/snappy",
 *       "KnpLabs/KnpBundles",
 *       "KnpLabs/KnpSnappyBundle"
 *     ]
 */
export const action = {
  pattern: '/repos/:org',
  methods: ['get'],
  middlewares: [handle]
};

async function handle (req, res, next) {
  res.result = await handleCommand(new commands.ListOrgRepos(req.params.org));

  next();
}
