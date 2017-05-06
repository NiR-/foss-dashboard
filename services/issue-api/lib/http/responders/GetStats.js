import halson from 'halson';

export default function GetStats ({router}, req, res, next) {
  res.format({
    'application/json': (req, res) => res.status(200).json(serialize(res.payload)),
    'application/hal+json': (req, res) => halFormatter({router}, req, res.status(200)),
    'default': (req, res) => res.sendStatus(406)
  });
}

function serialize ({name, issues, prs}) {
  const openIssues =  issues.byDay.length ? issues.byDay.slice(-1).pop().open : 0;
  const openPRs = prs.byDay.length ? prs.byDay.slice(-1).pop().open : 0;

  return {
    name,
    issues: {byDay: issues.byDay, newest: issues.newest, oldest: issues.oldest, open: openIssues},
    prs: {byDay: prs.byDay, newest: prs.newest, oldest: prs.oldest, open: openPRs}
  };
}

function halFormatter ({router}, req, res) {
  const hal = halson(serialize(res.payload))
      .addLink('self', router.getUrl(req.action, req.params))
    ;

  res.json(hal);
}
