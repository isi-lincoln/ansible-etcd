## Validation

So lets verify that this scheme works as we intended it.

On `x` we want to make sure our proxy is connecting, and using namespacing correctly.

```
rvn@x:~$ sudo apt install -qy etcd-client
rvn@x:~$ ETCDCTL_API=3 etcdctl put --endpoints localhost:2379 a b
rvn@x:~$ ETCDCTL_API=3 etcdctl get --prefix "" --endpoints localhost:2379
a
b
```

So that looks correct.

Now on a,b, or c.  We want to verify that the data shows up, and that it is namespaced.

```
I have no name!@a:/opt/bitnami/etcd$ ETCDCTL_API=3 etcdctl --key /etc/etcd/db-key.pem --cert /etc/etcd/db.pem --cacert /etc/etcd/ca.pem --endpoints https://dba:2379 get --prefix ""                              
/llama/a
b
```

So it all looks correct.
