'use strict';

const _ = require('lodash');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));

const {
  URL,
} = require(`url`);

const {
  createRemoteFileNode,
} = require(`gatsby-source-filesystem`);

const nodeFromData = (datum, createNodeId) => {
  // Reject null ids
  if (!_.has(datum, 'id')) {
    return {};
  }

  const {
      attributes: {
        id: _attributes_id,
      } = {},
    } = datum,
    attributes = (0, _objectWithoutPropertiesLoose2.default)(datum.attributes, ['id']);
  const preservedId = typeof _attributes_id !== `undefined` ? {
    _attributes_id,
  } : {};
  return Object.assign({
    id: createNodeId(datum.id),
    drupal_id: datum.id,
    parent: null,
    drupal_parent_menu_item: attributes.parent,
    children: [],
  }, attributes, preservedId, {
    drupal_relationships: datum.relationships,
    relationships: {},
    internal: {
      type: datum.type.replace(/-|__|:|\.|\s/g, `_`),
    },
  });
};

exports.nodeFromData = nodeFromData;

const isFileNode = node => node.internal.type === `files` || node.internal.type === `file__file`;

exports.isFileNode = isFileNode;

exports.downloadFile = async ({
  node,
  store,
  cache,
  createNode,
  createNodeId,
}, {
  basicAuth,
  baseUrl,
}) => {
  // handle file downloads
  if (isFileNode(node)) {
    let fileNode;

    try {
      let fileUrl = node.url;

      if (typeof node.uri === `object`) {
        // Support JSON API 2.x file URI format https://www.drupal.org/node/2982209
        fileUrl = node.uri.url;
      } // Resolve w/ baseUrl if node.uri isn't absolute.


      const url = new URL(`${baseUrl}${fileUrl}`, baseUrl); // If we have basicAuth credentials, add them to the request.

      const auth = typeof basicAuth === `object` ? {
        htaccess_user: basicAuth.username,
        htaccess_pass: basicAuth.password,
      } : {};
      fileNode = await createRemoteFileNode({
        url: url.href,
        store,
        cache,
        createNode,
        createNodeId,
        parentNodeId: node.id,
        auth,
      });
    } catch (e) {// Ignore
    }

    if (fileNode) {
      node.localFile___NODE = fileNode.id;
    }
  }
};
