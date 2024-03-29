<template>
  <div class="container-fluid">
    <h1 class="text-center"><span>🕮</span> Telefonbuch</h1>
    <BookSettings @filter-casesense="toggleCaseSens($event)" @toggle-filter="toggleFilter($event)" />

    <NewEntry v-if="showNewEntry" @new-entry="addNewEntry($event)" :entriesHeader="entriesHeader" />
    <hr />
    <small
      ><i>{{ sortedEntries.length }} Einträge</i></small
    >
    <table class="table table-hover table-striped table-sm">
      <thead>
        <tr class="border">
          <EntryHeader
            role="button"
            v-bind:key="header"
            v-for="header in entriesHeader"
            :header="header"
            :sortBy="sortBy"
            :sortASC="sortASC"
            @sort-by-field="sortByHeaderField($event)"
          />
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <BookFilter v-if="showFilter" :entriesHeader="entriesHeader" @set-filter="setFilter($event)" />
        <BookEntry
          v-bind:key="entry.id"
          v-for="entry in sortedEntries"
          :entry="entry"
          @delete-entry="deleteEntry($event)"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { entries } from "./seed";

import BookEntry from "./components/BookEntry.vue";
import NewEntry from "./components/NewEntry.vue";
import EntryHeader from "./components/EntryHeader.vue";
import BookFilter from "./components/BookFilter.vue";
import BookSettings from "./components/BookSettings.vue";

export default {
  name: "App",
  components: {
    BookEntry,
    NewEntry,
    EntryHeader,
    BookFilter,
    BookSettings,
  },
  data() {
    return {
      entries: entries,
      entriesHeader: ["Name", "Adresse", "Telefon", "E-Mail"],
      keyHeaderMap: {
        Name: "name",
        Adresse: "address",
        Telefon: "phone",
        "E-Mail": "email",
      },
      sortBy: "Name",
      sortASC: true,
      showFilter: true,
      showNewEntry: true,
      filterActive: false,
      filterEntry: [],
      filterCaseSens: true,
    };
  },
  emits: ["delete-entry", "new-entry", "sort-by-field", "toggle-filter", "filter-casesens", "hide-new-entry"],
  computed: {
    sortedEntries() {
      let sortByKey;
      let entries = this.entries;

      if (this.filterActive) {
        entries = entries.filter((entry) => {
          if (!this.filterCaseSens) {
            if (
              entry.name.toLowerCase().indexOf(this.filterEntry.Name.toLowerCase()) >= 0 &&
              entry.address.toLowerCase().indexOf(this.filterEntry.Adresse.toLowerCase()) >= 0 &&
              entry.phone.toLowerCase().indexOf(this.filterEntry.Telefon.toLowerCase()) >= 0 &&
              entry.email.toLowerCase().indexOf(this.filterEntry["E-Mail"].toLowerCase()) >= 0
            ) {
              return true;
            }
          } else {
            if (
              entry.name.indexOf(this.filterEntry.Name) >= 0 &&
              entry.address.indexOf(this.filterEntry.Adresse) >= 0 &&
              entry.phone.indexOf(this.filterEntry.Telefon) >= 0 &&
              entry.email.indexOf(this.filterEntry["E-Mail"]) >= 0
            ) {
              return true;
            }
          }
        });
      }

      sortByKey = this.keyHeaderMap[this.sortBy];

      entries = entries.sort((a, b) => {
        if (a[sortByKey] < b[sortByKey]) {
          return -1;
        }
        if (a[sortByKey] > b[sortByKey]) {
          return 1;
        }
        return 0;
      });

      if (!this.sortASC) {
        return entries.reverse();
      }
      return entries;
    },
  },
  methods: {
    toggleCaseSens(casesens) {
      this.filterCaseSens = casesens;
    },
    toggleFilter(filter) {
      this.showFilter = filter;
    },
    deleteEntry(entryId) {
      const entryIndex = this.entries.findIndex((entry) => entry.id === entryId);
      this.entries.splice(entryIndex, 1);
    },
    addNewEntry(newEntry) {
      const newEntryObject = newEntry;
      this.entries.push({
        id: Date.now(),
        name: newEntryObject.Name,
        address: newEntryObject.Adresse,
        phone: newEntryObject.Telefon,
        email: newEntryObject["E-Mail"],
      });
    },
    sortByHeaderField(headerField) {
      if (this.sortBy === headerField.header) {
        this.sortASC = headerField.sortASC;
      }
      this.sortBy = headerField.header;
    },
    setFilter(filterObj) {
      this.filterEntry = filterObj;
      this.filterActive = false;
      for (const key in filterObj) {
        if (filterObj[key] !== "") {
          this.filterActive = true;
        }
      }
    },
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";

table {
  table-layout: fixed;
}
</style>
