import {Http} from '../../Chassis';
import {GetStats as responder} from '../responders';
import {GetStats as message, errors as DomainErrors} from '../../domain';

@Http.route({
  name: 'GetStats',
  pattern: '/issues/stats/:repo',
  methods: ['GET'],
  middlewares: ['validate', 'handle', responder]
})
export default class GetStats {
  static validate ({params: {repo}}, res, next) {
    if (repo.indexOf('/') === -1) {
      return next(new Http.errors.HttpClientError('InvalidRepoName'));
    }

    next();
  }

  static async handle (container, {params: {repo}}, res, next) {
    try {
      res.payload = await message.handle(container, {repo});
    } catch (err) {
      if (err instanceof DomainErrors.RepoNotFoundError) {
        return next(new Http.errors.HttpClientError('RepoNotFound', 404));
      }

      return next(err);
    }

    next();
  }
}

