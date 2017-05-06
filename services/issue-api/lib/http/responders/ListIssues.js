export default function ListIssues ({router}, req, res, next) {
  const issues = res.payload;

  res.format({
    'application/json': (req, res) => res.status(200).json(serialize(issues)),
    // 'application/hal+json': (req, res) => res.status(200).json(halFormatter(issues)),
    'default': (req, res) => res.status(406)
  });
}

function serialize (issues) {
  return issues.map((issue) => {
    return {
      id: issue.number,
      isPR: issue.isPR,
      name: issue.title,
      author: issue.author,
      created: issue.created
    }
  });
}
