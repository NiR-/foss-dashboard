import axios from 'axios';
import {RepoNotFoundError} from '../errors';

export async function getStats ({fullName: repo}) {
  try {
    const {data} = await axios.get(`/issues/stats/${encodeURIComponent(repo)}`);

    return data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw RepoNotFoundError(repo);
    }

    throw err;
  }
}
