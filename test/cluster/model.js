topo = {
  name: 'etcd',
  nodes: [ubuntu('a'), ubuntu('b'), ubuntu('c'), ubuntu('x')],
  switches: [cumulus('s')],
  links: [
    Link('a', 1, 's', 1),
    Link('b', 1, 's', 2),
    Link('c', 1, 's', 3),
    Link('x', 1, 's', 4),
  ]
}

function ubuntu(name) {
  return {
    name: name,
    image: 'ubuntu-2204',
    memory: { capacity: GB(2) },
    proc: { cores: 2 }
  }
}

function cumulus(name) {
  return {
    name: name,
    image: 'cumulusvx-4.1',
    memory: { capacity: GB(2) },
    proc: { cores: 2 }
  }
}
