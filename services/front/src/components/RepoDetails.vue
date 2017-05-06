<template>
  <div id="repo-details">
    <header class="row">
      <div class="col-md-1">
        <a href="javascript:window.history.back()"><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
      </div>
      <h1 class="col-md">{{ name }}</h1>
    </header>

    <div class="row">
      <canvas class="col-md-6 col-sm-12" id="open-issues"></canvas>
      <canvas class="col-md-6 col-sm-12" id="created-closed-issues"></canvas>
    </div>
    <div class="row">
      <canvas class="col-md-6 col-sm-12" id="open-prs"></canvas>
      <canvas class="col-md-6 col-sm-12" id="created-closed-prs"></canvas>
    </div>
  </div>
</template>

<script>
import {Issues} from '../resources'
import Chart from 'chart.js'

export default {
  name: 'repo-details',
  data: function () {
    return {
      name: null,
      stats: null,
      chats: {
        sumIssues: null,
        diffIssues: null,
        sumPRs: null,
        diffPRs: null
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    Issues
      .getStats({fullName: to.params.repo})
      .then(stats => {
        console.log(stats);
        next(vm => {
          vm.name = to.params.repo;
          vm.issues = stats.issues;
          vm.prs = stats.prs;
          vm.drawCharts();
        });
      })
      .catch(() => {
        next(false)
      })
    ;
  },
  created: function () {
    this.drawCharts();
  },
  methods: {
    drawCharts: function () {
      this.charts.sumIssues = this.drawSumChart(document.getElementById('open-issues'), this.issues.byDay);
      this.charts.diffIssues = this.drawDiffChart(document.getElementById('created-closed-issues'), this.issues.byDay);
      this.charts.sumPRs = this.drawSumChart(document.getElementById('open-prs'), this.prs.byDay);
      this.charts.diffPRs = this.drawDiffChart(document.getElementById('created-closed-issues'), this.prs.byDay);
    },
    drawSumChart: function (el, stats) {
      if (stats === null) {
        return
      }

      const labels = this.stats.map(stat => stat.date);
      const openData = this.stats.map(stat => stat.open);

      try {
        return new Chart(el, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Open',
              lineTension: 0,
              pointStyle: 'triangle',
              data: openData
            }]
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    drawDiffChart: function (el, stats) {
      if (stats === null) {
        return
      }

      const labels = this.stats.map(stat => stat.date);
      const createdData = this.stats.map(stat => stat.created);
      const closedData = this.stats.map(stat => stat.closed);

      try {
        this.chart = new Chart(el, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Created',
                borderColor: 'rgba(220, 40, 0, 0.1)',
                lineTension: 0,
                data: createdData
              },
              {
                label: 'Closed',
                borderColor: 'rgba(40, 220, 0, 0.1)',
                lineTension: 0,
                data: closedData
              }
            ]
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    async $route () {
      this.stats = null;
      this.stats = await Issues.getStats({repo: this.$route.repo});
    }
  }
}
</script>
