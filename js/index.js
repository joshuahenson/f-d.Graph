/* global d3 */

const width = 800;
const height = 600;

const force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height]);

const svg = d3.select('#root').append('svg')
    .attr('width', width)
    .attr('height', height);

const defs = svg.append('defs');

d3.json('../json/data.json', (error, data) => {
  if (error) console.error(error);
  console.log(data.pubAvatar);
  const authorIndex = {};
  const nodes = [{ author: 'Free Code Camp', avatar: data.pubAvatar, value: 50 }];
  const links = [];

  // build nodes and links
  data.articles.forEach((d) => {
    const nodesLength = nodes.length;
    if (d.author in authorIndex) {
      nodes[authorIndex[d.author]].value += 1;
      links.push({ source: nodesLength, target: authorIndex[d.author] });
    } else {
      authorIndex[d.author] = nodesLength;
      nodes.push({ author: d.author, avatar: d.avatar, value: 1 });
      links.push({ source: nodesLength, target: 0 });
      links.push({ source: nodesLength + 1, target: nodesLength });
    }
    nodes.push({ author: d.author, title: d.title, url: d.url });
  });

  force
    .nodes(nodes)
    .links(links)
    .start();

  const link = svg.selectAll('.link')
      .data(links)
    .enter().append('line')
      .attr('class', 'link');

  const node = svg.selectAll('.node')
      .data(nodes)
    .enter().append('g')
      .attr('class', 'node')
      .call(force.drag);

  // create patterns to fill circles with avatars
  nodes.filter(d => d.avatar).forEach(d => {
    console.log(d);
    const r = Math.pow(d.value * 325, 1 / 3);
    const size = r * 2;
    defs.append('pattern')
      .attr('id', d.author.replace(/ /g, '_'))
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', size)
      .attr('height', size)
      .attr('x', -r)
      .attr('y', -r)
      .append('image')
        .attr('xlink:href', d.avatar)
        .attr('width', size)
        .attr('height', size)
        .attr('x', 0)
        .attr('y', 0);
  });

  // append circle filled with image pattern for avatars or color
  node.append('circle')
    .attr('r', d => Math.pow(d.value * 325, 1 / 3) || 5)
    .style('fill', d => (d.avatar ? `url(#${d.author.replace(/ /g, '_')})` : '#006400'));

  force.on('tick', () => {
    link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x}, ${d.y})`);
  });
}); // end d3.json
