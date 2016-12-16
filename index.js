'use strict';

const app = require('express')();
const got = require('got');
const pify = require('pify');
const xml2js = require('xml2js');
const parseString = pify(xml2js.parseString);
const PORT = process.env.PORT || 3000;

const getReleases = (username, repository) => {
  return got(`https://github.com/${username}/${repository}/releases.atom`)
    .then(response => parseString(response.body))
    .then(json => json.feed.entry);
};

const getTags = (username, repository) => {
  return got(`https://github.com/${username}/${repository}/tags.atom`)
    .then(response => parseString(response.body))
    .then(json => json.feed.entry);
};

app.use('/:username/:repository/releases', (request, response) => {
  const username = request.params.username;
  const repository = request.params.repository;

  return getReleases(username, repository).then(entry => response.json(entry));
});

app.use('/:username/:repository/tags', (request, response) => {
  const username = request.params.username;
  const repository = request.params.repository;

  return getTags(username, repository).then(entry => response.json(entry));
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
