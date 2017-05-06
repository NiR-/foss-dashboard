import {orderBy, sortBy, defaults} from 'lodash';
import moment from 'moment';

export function generateStats (issues) {
  const stats = {byDay: byDay(issues)};

  if (issues.length > 0) {
    const ordered = orderBy(issues, 'created');
    stats.newest = ordered.slice(-1).pop().created;
    stats.oldest = ordered.slice(0, 1).pop().created;
  }

  return stats;
}

function byDay (issues) {
  const sums = sumIssues(issues);
  let relative = 0;

  for (let sum of sums) {
    relative = relative + sum.created - sum.closed;
    sum.open = relative;
  }

  return sums;
}

function sumIssues (issues) {
  const days = {};

  for (let issue of issues) {
    let created = moment(issue.created).startOf('day');
    let dayOfCreation = getCollectionItem(days, created);
    dayOfCreation.created++;

    if (issue.closed) {
      let closed = moment(issue.closed).startOf('day');
      let dayOfClosing = getCollectionItem(days, closed);
      dayOfClosing.closed++;
    }
  }

  return sortBy(days, 'date');
}

function getCollectionItem (collection, date) {
  const key = date.format('YYYYMMDD');
  collection[key] = defaults(collection[key], {date: date.format(), created: 0, closed: 0, open: 0});

  return collection[key];
}
