/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface NodeRegistryInterface extends ethers.utils.Interface {
  functions: {
    "createOrUpdateNode(address,string)": FunctionFragment;
    "createOrUpdateNodeSelf(string)": FunctionFragment;
    "getNode(address)": FunctionFragment;
    "getNodeByNumber(uint256)": FunctionFragment;
    "getNodes()": FunctionFragment;
    "headNode()": FunctionFragment;
    "kickOut(address)": FunctionFragment;
    "nodeCount()": FunctionFragment;
    "nodes(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeNode(address)": FunctionFragment;
    "removeNodeSelf()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "requiresWhitelist()": FunctionFragment;
    "setRequiresWhitelist(bool)": FunctionFragment;
    "tailNode()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "whitelist(address)": FunctionFragment;
    "whitelistApproveNode(address)": FunctionFragment;
    "whitelistRejectNode(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createOrUpdateNode",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createOrUpdateNodeSelf",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getNode", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getNodeByNumber",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getNodes", values?: undefined): string;
  encodeFunctionData(functionFragment: "headNode", values?: undefined): string;
  encodeFunctionData(functionFragment: "kickOut", values: [string]): string;
  encodeFunctionData(functionFragment: "nodeCount", values?: undefined): string;
  encodeFunctionData(functionFragment: "nodes", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "removeNode", values: [string]): string;
  encodeFunctionData(
    functionFragment: "removeNodeSelf",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requiresWhitelist",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRequiresWhitelist",
    values: [boolean]
  ): string;
  encodeFunctionData(functionFragment: "tailNode", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "whitelist", values: [string]): string;
  encodeFunctionData(
    functionFragment: "whitelistApproveNode",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistRejectNode",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "createOrUpdateNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOrUpdateNodeSelf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getNodeByNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getNodes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "headNode", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "kickOut", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nodeCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nodes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removeNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeNodeSelf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requiresWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRequiresWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tailNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "whitelist", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "whitelistApproveNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistRejectNode",
    data: BytesLike
  ): Result;

  events: {
    "NodeRemoved(address)": EventFragment;
    "NodeUpdated(address,string,uint256,uint256)": EventFragment;
    "NodeWhitelistApproved(address)": EventFragment;
    "NodeWhitelistRejected(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RequiresWhitelistChanged(bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NodeRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NodeUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NodeWhitelistApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NodeWhitelistRejected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequiresWhitelistChanged"): EventFragment;
}

export class NodeRegistry extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: NodeRegistryInterface;

  functions: {
    createOrUpdateNode(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createOrUpdateNode(address,string)"(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createOrUpdateNodeSelf(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createOrUpdateNodeSelf(string)"(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getNode(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        }
      ]
    >;

    "getNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        }
      ]
    >;

    getNodeByNumber(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        }
      ]
    >;

    "getNodeByNumber(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        }
      ]
    >;

    getNodes(
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        })[]
      ]
    >;

    "getNodes()"(
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        })[]
      ]
    >;

    headNode(overrides?: CallOverrides): Promise<[string]>;

    "headNode()"(overrides?: CallOverrides): Promise<[string]>;

    kickOut(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "kickOut(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    nodeCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    "nodeCount()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    nodes(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        },
        string,
        string
      ] & {
        node: [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        };
        next: string;
        prev: string;
      }
    >;

    "nodes(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        },
        string,
        string
      ] & {
        node: [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        };
        next: string;
        prev: string;
      }
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    removeNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "removeNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeNodeSelf(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "removeNodeSelf()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    requiresWhitelist(overrides?: CallOverrides): Promise<[boolean]>;

    "requiresWhitelist()"(overrides?: CallOverrides): Promise<[boolean]>;

    setRequiresWhitelist(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setRequiresWhitelist(bool)"(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tailNode(overrides?: CallOverrides): Promise<[string]>;

    "tailNode()"(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    whitelist(arg0: string, overrides?: CallOverrides): Promise<[number]>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    whitelistApproveNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "whitelistApproveNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    whitelistRejectNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "whitelistRejectNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  createOrUpdateNode(
    node: string,
    metadata_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createOrUpdateNode(address,string)"(
    node: string,
    metadata_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createOrUpdateNodeSelf(
    metadata_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createOrUpdateNodeSelf(string)"(
    metadata_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getNode(
    nodeAddress: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    }
  >;

  "getNode(address)"(
    nodeAddress: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    }
  >;

  getNodeByNumber(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    }
  >;

  "getNodeByNumber(uint256)"(
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    }
  >;

  getNodes(
    overrides?: CallOverrides
  ): Promise<
    ([string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    })[]
  >;

  "getNodes()"(
    overrides?: CallOverrides
  ): Promise<
    ([string, string, BigNumber] & {
      nodeAddress: string;
      metadata: string;
      lastSeen: BigNumber;
    })[]
  >;

  headNode(overrides?: CallOverrides): Promise<string>;

  "headNode()"(overrides?: CallOverrides): Promise<string>;

  kickOut(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "kickOut(address)"(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  nodeCount(overrides?: CallOverrides): Promise<BigNumber>;

  "nodeCount()"(overrides?: CallOverrides): Promise<BigNumber>;

  nodes(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      },
      string,
      string
    ] & {
      node: [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      };
      next: string;
      prev: string;
    }
  >;

  "nodes(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      },
      string,
      string
    ] & {
      node: [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      };
      next: string;
      prev: string;
    }
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  removeNode(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "removeNode(address)"(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeNodeSelf(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "removeNodeSelf()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "renounceOwnership()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  requiresWhitelist(overrides?: CallOverrides): Promise<boolean>;

  "requiresWhitelist()"(overrides?: CallOverrides): Promise<boolean>;

  setRequiresWhitelist(
    value: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setRequiresWhitelist(bool)"(
    value: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tailNode(overrides?: CallOverrides): Promise<string>;

  "tailNode()"(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  whitelist(arg0: string, overrides?: CallOverrides): Promise<number>;

  "whitelist(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<number>;

  whitelistApproveNode(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "whitelistApproveNode(address)"(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  whitelistRejectNode(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "whitelistRejectNode(address)"(
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createOrUpdateNode(
      node: string,
      metadata_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "createOrUpdateNode(address,string)"(
      node: string,
      metadata_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createOrUpdateNodeSelf(
      metadata_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "createOrUpdateNodeSelf(string)"(
      metadata_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getNode(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      }
    >;

    "getNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      }
    >;

    getNodeByNumber(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      }
    >;

    "getNodeByNumber(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      }
    >;

    getNodes(
      overrides?: CallOverrides
    ): Promise<
      ([string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      })[]
    >;

    "getNodes()"(
      overrides?: CallOverrides
    ): Promise<
      ([string, string, BigNumber] & {
        nodeAddress: string;
        metadata: string;
        lastSeen: BigNumber;
      })[]
    >;

    headNode(overrides?: CallOverrides): Promise<string>;

    "headNode()"(overrides?: CallOverrides): Promise<string>;

    kickOut(nodeAddress: string, overrides?: CallOverrides): Promise<void>;

    "kickOut(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    nodeCount(overrides?: CallOverrides): Promise<BigNumber>;

    "nodeCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    nodes(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        },
        string,
        string
      ] & {
        node: [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        };
        next: string;
        prev: string;
      }
    >;

    "nodes(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        },
        string,
        string
      ] & {
        node: [string, string, BigNumber] & {
          nodeAddress: string;
          metadata: string;
          lastSeen: BigNumber;
        };
        next: string;
        prev: string;
      }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    removeNode(nodeAddress: string, overrides?: CallOverrides): Promise<void>;

    "removeNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    removeNodeSelf(overrides?: CallOverrides): Promise<void>;

    "removeNodeSelf()"(overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    requiresWhitelist(overrides?: CallOverrides): Promise<boolean>;

    "requiresWhitelist()"(overrides?: CallOverrides): Promise<boolean>;

    setRequiresWhitelist(
      value: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "setRequiresWhitelist(bool)"(
      value: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    tailNode(overrides?: CallOverrides): Promise<string>;

    "tailNode()"(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelist(arg0: string, overrides?: CallOverrides): Promise<number>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<number>;

    whitelistApproveNode(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "whitelistApproveNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelistRejectNode(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "whitelistRejectNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    NodeRemoved(
      nodeAddress: string | null
    ): TypedEventFilter<[string], { nodeAddress: string }>;

    NodeUpdated(
      nodeAddress: string | null,
      metadata: null,
      isNew: BigNumberish | null,
      lastSeen: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber],
      {
        nodeAddress: string;
        metadata: string;
        isNew: BigNumber;
        lastSeen: BigNumber;
      }
    >;

    NodeWhitelistApproved(
      nodeAddress: string | null
    ): TypedEventFilter<[string], { nodeAddress: string }>;

    NodeWhitelistRejected(
      nodeAddress: string | null
    ): TypedEventFilter<[string], { nodeAddress: string }>;

    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    RequiresWhitelistChanged(
      value: boolean | null
    ): TypedEventFilter<[boolean], { value: boolean }>;
  };

  estimateGas: {
    createOrUpdateNode(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createOrUpdateNode(address,string)"(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createOrUpdateNodeSelf(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createOrUpdateNodeSelf(string)"(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getNode(nodeAddress: string, overrides?: CallOverrides): Promise<BigNumber>;

    "getNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNodeByNumber(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getNodeByNumber(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNodes(overrides?: CallOverrides): Promise<BigNumber>;

    "getNodes()"(overrides?: CallOverrides): Promise<BigNumber>;

    headNode(overrides?: CallOverrides): Promise<BigNumber>;

    "headNode()"(overrides?: CallOverrides): Promise<BigNumber>;

    kickOut(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "kickOut(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    nodeCount(overrides?: CallOverrides): Promise<BigNumber>;

    "nodeCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    nodes(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "nodes(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    removeNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "removeNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeNodeSelf(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "removeNodeSelf()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    requiresWhitelist(overrides?: CallOverrides): Promise<BigNumber>;

    "requiresWhitelist()"(overrides?: CallOverrides): Promise<BigNumber>;

    setRequiresWhitelist(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setRequiresWhitelist(bool)"(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tailNode(overrides?: CallOverrides): Promise<BigNumber>;

    "tailNode()"(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    whitelist(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    whitelistApproveNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "whitelistApproveNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    whitelistRejectNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "whitelistRejectNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createOrUpdateNode(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createOrUpdateNode(address,string)"(
      node: string,
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createOrUpdateNodeSelf(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createOrUpdateNodeSelf(string)"(
      metadata_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getNode(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getNode(address)"(
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNodeByNumber(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getNodeByNumber(uint256)"(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNodes(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getNodes()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    headNode(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "headNode()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kickOut(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "kickOut(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    nodeCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "nodeCount()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nodes(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "nodes(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "removeNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeNodeSelf(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "removeNodeSelf()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "renounceOwnership()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    requiresWhitelist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "requiresWhitelist()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setRequiresWhitelist(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setRequiresWhitelist(bool)"(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tailNode(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "tailNode()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    whitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    whitelistApproveNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "whitelistApproveNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    whitelistRejectNode(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "whitelistRejectNode(address)"(
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}