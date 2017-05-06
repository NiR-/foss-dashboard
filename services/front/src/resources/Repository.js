import axios from 'axios';

export async function list ({org}) {
  const {data} = await axios.get(`/repos/${org}`);

  return data;
}

export async function get ({repo}) {
  const {data} = await axios.get(`/repo/${repo}`);

  return data;
}
