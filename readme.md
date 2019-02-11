etcd
====

This role configures an etcd cluster.

## Variables


| name | required | default | description |
| ---- | ---------| ------- | ----------- |
| hosts | **yes** | | a list of hosts that comprise the cluster |
| alias | **yes** | | etcd cluster name for a host |
| address | **yes** | | address to advertise to peers |
| endpoint | **yes** | | etcd connection string for host |
| ip | **yes** | | listening address |
| ca\_pem | no | | certificate authority to used for secured setups |
| db\_pem | no | | database cert to used for secured setups |
| db\_key | no | | database key to used for secured setups |
| keygen | no | no | generate keys for the deployment |
| auth\_hosts| yes | | list of authorized hosts (used in TLS SANs) |
| client\_cert\_auth | no | yes | authenticate clients with certs |

### Proxy variables

The following are used when `proxy=true`

| name | required | default | description |
| ---- | ---------| ------- | ----------- |
| proxy\_name | **yes** | | name of proxy |
| proxy\_endpoints | **yes** | | etcd cluster endpoints |
| ca\_pem | no | | certificate authority to used for secured setups |
| db\_pem | no | | database cert to used for secured setups |
| db\_key | no | | database key to used for secured setups |

## Notes

Etcd instances are run via systemd.

```shell
service etcd status
journalctl -u etcd
```

## Examples

### Single instance deployment

```yaml
hosts: a
become: true
vars:
  a: 10.0.0.1
tasks:
  - import_role:
      name: etcd
    vars:
      keygen: yes
      install: yes
      alias: a
      address: "{{ansible_eth0.ipv4.address}}"
      ip: "{{ansible_eth0.ipv4.address}}"
      auth_hosts: [dba, 10.0.0.1]
      hosts:
        - alias: a
          endpoint: a=https://{{ansible_eth0.ipv4.address}}:2380
```

### Cluster deployment

```yaml
hosts: localhost
tasks:
  - import_role:
      name: etcd
    vars:
      keygen: yes
      local: yes
      auth_hosts:
        - dba,10.0.0.1
        - dbb,10.0.0.2
        - dbc,10.0.0.3

hosts: [a,b,c]
become: true
vars:
  a: 10.0.0.1
  b: 10.0.0.2
  c: 10.0.0.3
tasks:
  - import_role:
      name: etcd
    vars:
      install: yes
      alias: "{{inventory_hostname_short}}"
      address: "db{{inventory_hostname_short}}"
      ip: "{{vars[inventory_hostname_short]}}"
      hosts:
        - alias: a
          endpoint: a=https://dba:2380
        - alias: b
          endpoint: b=https://dbb:2380
        - alias: c
          endpoint: c=https://dbc:2380
```

### Proxy

```
hosts: x
become: true
vars:
tasks:
  - import_role:
      name: etcd
    vars:
      proxy: yes
      proxy_name: llama
      proxy_endpoints: https://dba:2379,https://dbb:2379,https://dbc:2379
      ca_pem: /etc/etcd/ca.pem
      db_pem: /etc/etcd/db.pem
      db_key: /etc/etcd/db-key.pem

```
