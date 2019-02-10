topo = {
  name: 'etcd',
  nodes: [buster('a')],
}

function buster(name) {
  return {
    name: name,
    image: 'debian-buster',
    memory: { capacity: GB(2) },
    proc: { cores: 2 }
  }
}

