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

interface StreamStorageRegistryInterface extends ethers.utils.Interface {
  functions: {
    "_trustedForwarder()": FunctionFragment;
    "addAndRemoveStorageNodes(string,address[],address[])": FunctionFragment;
    "addStorageNode(string,address)": FunctionFragment;
    "isStorageNodeOf(string,address)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
    "nodeRegistry()": FunctionFragment;
    "pairs(string,address)": FunctionFragment;
    "removeStorageNode(string,address)": FunctionFragment;
    "streamRegistry()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_trustedForwarder",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addAndRemoveStorageNodes",
    values: [string, string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addStorageNode",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isStorageNodeOf",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "nodeRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pairs",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeStorageNode",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "streamRegistry",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "_trustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addAndRemoveStorageNodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addStorageNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isStorageNodeOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nodeRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pairs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeStorageNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "streamRegistry",
    data: BytesLike
  ): Result;

  events: {
    "Added(string,address)": EventFragment;
    "Removed(string,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Added"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Removed"): EventFragment;
}

export class StreamStorageRegistry extends Contract {
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

  interface: StreamStorageRegistryInterface;

  functions: {
    _trustedForwarder(overrides?: CallOverrides): Promise<[string]>;

    "_trustedForwarder()"(overrides?: CallOverrides): Promise<[string]>;

    addAndRemoveStorageNodes(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "addAndRemoveStorageNodes(string,address[],address[])"(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "addStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isStorageNodeOf(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isStorageNodeOf(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isTrustedForwarder(address)"(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    nodeRegistry(overrides?: CallOverrides): Promise<[string]>;

    "nodeRegistry()"(overrides?: CallOverrides): Promise<[string]>;

    pairs(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { dateCreated: BigNumber }>;

    "pairs(string,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { dateCreated: BigNumber }>;

    removeStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "removeStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    streamRegistry(overrides?: CallOverrides): Promise<[string]>;

    "streamRegistry()"(overrides?: CallOverrides): Promise<[string]>;
  };

  _trustedForwarder(overrides?: CallOverrides): Promise<string>;

  "_trustedForwarder()"(overrides?: CallOverrides): Promise<string>;

  addAndRemoveStorageNodes(
    streamId: string,
    addNodes: string[],
    removeNodes: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "addAndRemoveStorageNodes(string,address[],address[])"(
    streamId: string,
    addNodes: string[],
    removeNodes: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addStorageNode(
    streamId: string,
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "addStorageNode(string,address)"(
    streamId: string,
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isStorageNodeOf(
    streamId: string,
    nodeAddress: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isStorageNodeOf(string,address)"(
    streamId: string,
    nodeAddress: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isTrustedForwarder(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isTrustedForwarder(address)"(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  nodeRegistry(overrides?: CallOverrides): Promise<string>;

  "nodeRegistry()"(overrides?: CallOverrides): Promise<string>;

  pairs(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "pairs(string,address)"(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  removeStorageNode(
    streamId: string,
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "removeStorageNode(string,address)"(
    streamId: string,
    nodeAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  streamRegistry(overrides?: CallOverrides): Promise<string>;

  "streamRegistry()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    _trustedForwarder(overrides?: CallOverrides): Promise<string>;

    "_trustedForwarder()"(overrides?: CallOverrides): Promise<string>;

    addAndRemoveStorageNodes(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    "addAndRemoveStorageNodes(string,address[],address[])"(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    addStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "addStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isStorageNodeOf(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isStorageNodeOf(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isTrustedForwarder(address)"(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    nodeRegistry(overrides?: CallOverrides): Promise<string>;

    "nodeRegistry()"(overrides?: CallOverrides): Promise<string>;

    pairs(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pairs(string,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "removeStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    streamRegistry(overrides?: CallOverrides): Promise<string>;

    "streamRegistry()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    Added(
      streamId: null,
      nodeAddress: string | null
    ): TypedEventFilter<
      [string, string],
      { streamId: string; nodeAddress: string }
    >;

    Removed(
      streamId: null,
      nodeAddress: string | null
    ): TypedEventFilter<
      [string, string],
      { streamId: string; nodeAddress: string }
    >;
  };

  estimateGas: {
    _trustedForwarder(overrides?: CallOverrides): Promise<BigNumber>;

    "_trustedForwarder()"(overrides?: CallOverrides): Promise<BigNumber>;

    addAndRemoveStorageNodes(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "addAndRemoveStorageNodes(string,address[],address[])"(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "addStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isStorageNodeOf(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isStorageNodeOf(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isTrustedForwarder(address)"(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nodeRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    "nodeRegistry()"(overrides?: CallOverrides): Promise<BigNumber>;

    pairs(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "pairs(string,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "removeStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    streamRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    "streamRegistry()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    _trustedForwarder(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "_trustedForwarder()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addAndRemoveStorageNodes(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "addAndRemoveStorageNodes(string,address[],address[])"(
      streamId: string,
      addNodes: string[],
      removeNodes: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "addStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isStorageNodeOf(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isStorageNodeOf(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isTrustedForwarder(address)"(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nodeRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "nodeRegistry()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pairs(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "pairs(string,address)"(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeStorageNode(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "removeStorageNode(string,address)"(
      streamId: string,
      nodeAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    streamRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "streamRegistry()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}