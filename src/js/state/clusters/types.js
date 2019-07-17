/* @flow */

export type Cluster = {
  host: string,
  port: string,
  username: string,
  password: string
}

export type ClustersState = {
  saved: Cluster[],
  current: Cluster | null
}

export type ClusterAction = CLUSTER_REMOVE | CLUSTER_ADD | CLUSTER_SET

export type CLUSTER_REMOVE = {
  type: "CLUSTER_REMOVE",
  cluster: Cluster
}

export type CLUSTER_ADD = {
  type: "CLUSTER_ADD",
  cluster: Cluster
}

export type CLUSTER_SET = {
  type: "CLUSTER_SET",
  cluster: Cluster | null
}