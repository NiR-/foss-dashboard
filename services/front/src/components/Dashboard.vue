<template>
  <main id="dashboard">
    <h1>KnpLabs</h1>

    <data-table
      v-bind:config="columns"
      v-bind:data="repos"
      v-bind:default-sort-keys="['fullName']"
    >
      <template slot="content.fullName" scope="props">
        <router-link :to="{name: 'repo', params: {repo: props.value}}">{{ props.value }}</router-link>
        <a v-bind:href="props.row.url" target="_blank"><img src="../assets/gh-mark.png" :title="props.value" width="16" height="16" /></a>
      </template>
      <template slot="content.newestPR" scope="props">
        <span v-bind:title="props.value|moment|plainDate">{{ props.value|moment|fromNow }}</span>
      </template>
      <template slot="content.oldestPR" scope="props">
        <span v-bind:title="props.value|moment|plainDate">{{ props.value|moment|fromNow }}</span>
      </template>
      <template slot="content.newestIssue" scope="props">
        <span v-bind:title="props.value|moment|plainDate">{{ props.value|moment|fromNow }}</span>
      </template>
      <template slot="content.oldestIssue" scope="props">
        <span v-bind:title="props.value|moment|plainDate">{{ props.value|moment|fromNow }}</span>
      </template>
    </data-table>
  </main>
</template>

<script>
import {Repository, Issues} from '../resources';
import DataTable from './DataTable';
import moment from 'moment';

export default {
  name: 'dashboard',
  components: {DataTable},
  data: function () {
    return {
      org: 'KnpLabs',
      repos: [],
      columns: [
        {label: 'Name', name: 'fullName', pinned: true},
        {label: 'Deprecated ?', name: 'deprecated', type: Boolean},
        {label: 'Stargazers', name: 'stargazers', filterable: false},
        {label: 'License ?', name: 'license'},
        {label: 'Readme ?', name: 'readme', displayed: false, type: Boolean},
        {label: 'Changelog ?', name: 'changelog', displayed: false, type: Boolean},
        {label: 'COC ?', name: 'coc', displayed: false, type: Boolean},
        {label: 'Open PRs', name: 'openPRs', filterable: false},
        {label: 'Open Issues', name: 'openIssues', filterable: false},
        {label: 'Newest PR', name: 'newestPR', filterable: false, type: Date},
        {label: 'Oldest PR', name: 'oldestPR', filterable: false, type: Date},
        {label: 'Newest Issue', name: 'newestIssue', filterable: false, type: Date},
        {label: 'Oldest Issue', name: 'oldestIssue', filterable: false, type: Date}
      ]
    }
  },
  async created () {
    await this.loadRepos();
  },
  methods: {
    loadRepos: async function () {
      const repos = await Repository.list({org: this.org});
      this.repos = await Promise.all(repos.map(this.loadStats));
    },
    fetchStats: async function (repo) {
      try {
        const {issues, prs} = await Issues.getStats(repo);
        return {issues, prs};
      } catch (err) {
        return {issues: {open: null, newest: null, oldest: null}, prs: {open: null, newest: null, oldest: null}};
      }
    },
    loadStats: async function (repo) {
      const {issues, prs} = await this.fetchStats(repo);

      return {
        ...repo,
        openIssues: issues.open,
        openPRs: prs.open,
        newestIssue: issues.newest || null,
        newestPR: prs.newest || null,
        oldestIssue: issues.oldest || null,
        oldestPR: prs.oldest || null
      };
    }
  },
  filters: {
    moment: function (value) {
      return value !== null ? moment(value) : null;
    },
    fromNow: function (value) {
      return value !== null ? value.fromNow() : '';
    },
    plainDate: function (value) {
      return value !== null ? value.format('DD/MM/YY') : '';
    }
  }
}
</script>
