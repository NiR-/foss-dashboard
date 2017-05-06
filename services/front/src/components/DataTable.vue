<template>
  <div class="data-table">
    <div class="row">
      <div class="column-selector dropdown" v-if="columnSelector">
        <button class="btn dropdown-toggle" id="column-selector" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-gear" aria-hidden="true"></i>
        </button>
        <div class="dropdown-menu" aria-labelledby="column-selector">
          <div :class="{'dropdown-item': true, disabled: column.pinned}" v-for="column in columns" v-if="column.label !== undefined">
            <input type="checkbox" v-model="column.displayed" :id="`display-${column.name}`" :disabled="column.pinned === true" />
            <label :for="`display-${column.name}`">{{ column.label }}</label>
          </div>
        </div>
      </div>


      <div class="filter-dropdown dropdown" v-if="filterableColumns.length > 0">
        <button class="btn dropdown-toggle" id="filters" type="button" data-toggle="dropdown" arira-haspopup="true" aria-expanded="false">
          Filters
        </button>
        <div class="dropdown-menu" aria-labelledby="filters">
          <span class="dropdown-header">Filters by:</span>
          <div class="dropdown-item" v-for="column in filterableColumns">
            <input type="checkbox" :name="'filter-by-'+column.name" v-model="column.filter" />
            <label>{{ column.label }}</label>
            <template v-if="column.type === Boolean">
              <select v-model="column.filterBy" :name="'filter-by-'+column.name+'-value'">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </template>
            <template v-else-if="column.type === String || column.type === Array">
              <input type="text" v-model="column.filterBy" :name="'filter-by-'+column.name+'-value'" />
            </template>
          </div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            v-if="column.displayed"
            :class="getColumnClasses(column)"
          >
            {{ column.label }}
            <a href="javascript:;" @click="toggleSortKeys(column.name)" v-if="column.sortable">
              <i :class="getSortClasses(column)"></i>
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows">
          <td v-for="column in columns" v-if="column.displayed">
              <slot :name="`content.${column.name}`" :value="row[column.name]" :row="row">{{ row|value(column) }}</slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <span class="page" v-for="page in pages">
        <a href="javascript:;" @click="goToPage(page)" v-if="!isCurrentPage(page)">{{ page }}</a><!--
        --><span v-if="isCurrentPage(page)">{{ page }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';

function defaults (object, values) {
  for (let name in values) {
    if (object[name] !== undefined) {
      continue;
    }

    Vue.set(object, name, values[name]);
  }
  return object;
}

const COLUMN_DEFAULTS = {
  sortable: true,
  filterable: true,
  direction: 'asc',
  displayed: true,
  type: String,
  filter: false,
  filterBy: null
};

export default {
  name: 'data-table',
  data: function () {
    const columnNames = this.config.map(column => column.name);

    const config = this.config.map((column) => {
      return defaults(column, COLUMN_DEFAULTS);
    });
    this.columns = _.zipObject(columnNames, config);

    const undefinedColumns = _.filter(this.defaultSortKeys, sortKey => this.columns[sortKey] === undefined);
    if (undefinedColumns.length > 0) {
      throw new Error(`Default(s) sort column(s) "${undefinedColumns.concat(', ')}" are missing.`);
    }

    return {
      sortKeys: this.defaultSortKeys,
      page: 1
    };
  },
  props: {
    config: {type: Array, required: true},
    data: {type: Array, required: true},
    defaultSortKeys: {type: Array, required: false, default: () => []},
    columnSelector: {type: Boolean, required: false, default: true},
    perPage: {type: Number, default: 20}
  },
  computed: {
    rows: function () {
      const maxPage = this.getMaxPage();
      const page = this.page > maxPage ? maxPage : this.page;
      const start = (page - 1) * this.perPage;

      return this.getSortedRows().splice(start, this.perPage);
    },
    pages: function () {
      return _.range(1, this.getMaxPage());
    },
    filterableColumns: function () {
      return _.filter(this.columns, column => column.filterable);
    }
  },
  methods: {
    getMaxPage: function () {
      const sorted = this.getSortedRows();

      return Math.ceil(sorted.length / this.perPage);
    },
    getActiveFilters: function () {
      const columns = _.filter(this.columns, (column) => column.filter);

      return _.map(columns, (column) => {
        return {name: column.name, type: column.type, value: column.filterBy};
      });
    },
    getFilteredRows: function () {
      const filters = this.getActiveFilters();

      return _.filter(this.data, (row) => {
        for (let filter of filters) {
          let {name} = filter;
          if (filter.type === Boolean && row[name] !== filter.value) {
            return false;
          }

          if ((filter.value === null || filter.value === '')) {
            if (row[name] === null || row[name] === '') {
              continue;
            }
            return false;
          }
          if (filter.type === String && typeof row[name] === String && row[name].indexOf(filter.value) === -1) {
            return false;
          } else if (filter.type === Array && typeof row[name] === Array && !row[name].includes(filter.value)) {
            return false;
          }
        }
        return true;
      });
    },
    getSortedRows: function () {
      const directions = this.sortKeys.map((name) => this.getColumn(name).direction);

      return _.orderBy(this.getFilteredRows(), this.sortKeys, directions);
    },
    getColumn: function (name) {
      const column = this.columns[name];
      if (column === undefined) {
        throw new Error(`Column "${name}" not found.`);
      }
      return column;
    },
    toggleSortKeys: function (name) {
      const column = this.getColumn(name);
      if (!column.sortable) {
        throw new Error(`Column "${column.name}" is not sortable.`);
      }

      this.page = 1;
      if (this.sortKeys.includes(name)) {
        column.direction = column.direction === 'asc' ? 'desc' : 'asc';
        return
      }

      this.sortKeys = [name];
    },
    goToPage: function (page) {
      const maxPage = this.getMaxPage();

      this.page = page > maxPage ? maxPage : page;
    },
    getColumnClasses: function (column) {
      const classes = {
        sortable: column.sortable,
        active: this.sortKeys.includes(column.name)
      };
      classes[column.direction] = column.sortable;
      return classes;
    },
    getSortClasses: function (column) {
      const classes = ['fa'];

      if (this.sortKeys.includes(column.name)) {
        classes.push(column.direction === 'desc' ? 'fa-sort-desc' : 'fa-sort-asc');
      } else {
        classes.push('fa-sort');
      }

      return classes;
    },
    isCurrentPage: function (page) {
      return this.page === page;
    }
  },
  filters: {
    value: function (row, column) {
      const value = row[column.name];
      if (column.type === Boolean) {
        return value ? 'Yes' : 'No';
      } else if (column.Type === Array) {
        return value.concat(', ');
      }
      return value;
    }
  }
}
</script>

<style lang="scss" scoped>
th {
  text-align: center;
}
.column-selector {
  display: inline-block;
}
.pager .page::after {
  content: '-';
}
.pager .page:last-child::after {
  content: '';
}
</style>
