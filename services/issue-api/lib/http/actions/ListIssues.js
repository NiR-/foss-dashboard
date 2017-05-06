import {Http} from '../../Chassis';
import {ListIssues as responder} from '../responders';
import {ListIssues as message} from '../../domain';

@Http.route({
  name: 'ListIssues',
  pattern: '/issues/:repo',
  methods: ['GET'],
  middlewares: ['validate', 'handle', responder]
})
export default class ListIssues {
  static validate ({params: {repo}}, res, next) {
    if (repo.indexOf('/') === -1) {
      return next(new Http.errors.HttpClientError('InvalidRepoName'));
    }

    next();
  }

  static async handle (container, req, res, next) {
    const {repo} = req.params;
    const since = req.query.since || null;

    try {
      res.payload = await message.handle(container, {repo, since});
    } catch (err) {
      return next(err);
    }

    next();
  }
}
