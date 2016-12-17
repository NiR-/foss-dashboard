import {commands, handleCommand, errors} from '../../domain';
import {HttpClientError} from '../errors';

/**
 * @api {get} /repo/:repo Get details about a specific repository
 * @apiName GetRepo
 * @apiGroup repo-api
 * @apiVersion 0.1.0
 * @apiParam {String} repo Full name of the repo (e.g. 'owner/repo_name')
 * @apiExample {curl} Example usage:
 *     curl -s http://localhost/repo/KnpLabs%2FGaufrette | jq
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "openPRs": "33",
 *       "description": "PHP5 library that provides a filesystem abstraction layer − will be a feast for your files!",
 *       "stargazers": "1752",
 *       "openIssues": "103",
 *       "fullName": "KnpLabs/Gaufrette",
 *       "deprecated": "false",
 *       "coc": "false",
 *       "readme": "true",
 *       "license": "false",
 *       "name": "Gaufrette",
 *       "owner": "KnpLabs",
 *       "changelog": "false",
 *       "id": "1267753"
 *     }
 * @apiError (400) {String} error InvalidRepoName
 * @apiError (404) {String} error RepoNotFound
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "RepoNotFound"
 *     }
 */
export const action = {
  pattern: '/repo/:repo',
  methods: ['get'],
  middlewares: [validate, handle]
};

function validate (req, res, next) {
  const {repo} = req.params;

  if (repo.indexOf('/') === -1) {
    return next(new HttpClientError('InvalidRepoName'));
  }

  next();
}

async function handle (req, res, next) {
  try {
    res.result = await handleCommand(new commands.RetrieveRepo(req.params.repo));
  } catch (err) {
    if (err instanceof errors.RepoNotFoundError) {
      err = new HttpClientError('RepoNotFound');
    }

    throw err;
  }

  next();
}
