exports.dijkstra = (graph, start, end) => {
  // Simple Dijkstra algorithm implementation
  const distances = {};
  const prev = {};
  const queue = [];
  Object.keys(graph).forEach(node => {
    distances[node] = node === start ? 0 : Infinity;
    queue.push(node);
  });
  
  while (queue.length > 0) {
    let minNode = queue.reduce((min, node) => distances[node] < distances[min] ? distances[node] : min, Infinity);
    minNode = queue.find(node => distances[node] === minNode);
    queue.splice(queue.indexOf(minNode), 1);
    
    if (minNode === end) break;
    
    Object.keys(graph[minNode]).forEach(neighbor => {
      const alt = distances[minNode] + graph[minNode][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = minNode;
      }
    });
  }
  
  // Reconstruct path
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = prev[current];
  }
  
  return { distance: distances[end], path };
};