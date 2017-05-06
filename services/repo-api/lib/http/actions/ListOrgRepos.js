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
 *       {
 *         "openPRs": "33",
 *         "description": "PHP5 library that provides a filesystem abstraction layer − will be a feast for your files!",
 *         "stargazers": "1752",
 *         "openIssues": "103",
 *         "fullName": "KnpLabs/Gaufrette",
 *         "deprecated": "false",
 *         "coc": "false",
 *         "readme": "true",
 *         "license": "false",
 *         "name": "Gaufrette",
 *         "owner": "KnpLabs",
 *         "changelog": "false",
 *         "id": "1267753"
 *       },
 *     [
 *       {
 *         "openPRs": "33",
 *         "description": "",
 *         "stargazers": "1752",
 *         "openIssues": "103",
 *         "fullName": "KnpLabs/snappy",
 *         "deprecated": "false",
 *         "coc": "false",
 *         "readme": "true",
 *         "license": "false",
 *         "name": "snappy",
 *         "owner": "KnpLabs",
 *         "changelog": "false",
 *         "id": "1267753"
 *       },
 *       // ...
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
