import { ByteLengthParser, SerialPort } from 'serialport';

export enum RemoteSerialPacketType {
  StartReaction = 0x1,
  EndReaction = 0x2,
  EndReactionFailed = 0x3,
  LightsOut = 0x4,
  Handshake = 0x69,
  HandshakeAck = 0x6a
}

export enum SerialPacketType {
  Handshake = 0x1,
  TestQueued = 0x2
}

export type SerialReactionTestState =
  | {
      state: 'idle';
    }
  | {
      state: 'running';
    }
  | {
      state: 'lights-out';
    }
  | {
      state: 'finished';
      timeInMicros: number;
    }
  | {
      state: 'failed';
    };

export class SerialReactionTest {
  private _port: SerialPort;
  private _parser: ByteLengthParser;

  private _currentReactionTestState: SerialReactionTestState = {
    state: 'idle'
  };

  private _stateChangeListeners: Array<
    (
      newState: SerialReactionTestState,
      oldState: SerialReactionTestState
    ) => void
  > = [];

  public constructor(path: string) {
    this._port = new SerialPort({
      path,
      baudRate: 115200
    });

    this._parser = this._port.pipe(new ByteLengthParser({ length: 5 }));
    this._parser.on('data', (data: Buffer) => {
      const [type, ...payload] = data;
      this.handlePacket(type, payload);
    });
  }

  public sendBasicSerialPacket(
    packetType: SerialPacketType,
    data: number
  ): void {
    const buffer = new Uint8Array(5);
    buffer[0] = packetType;
    buffer[1] = data >> 24;
    buffer[2] = data >> 16;
    buffer[3] = data >> 8;
    buffer[4] = data;
    this._port.write(buffer);
  }

  public handlePacket(
    packetType: RemoteSerialPacketType,
    payload: number[]
  ): void {
    switch (packetType as RemoteSerialPacketType) {
      case RemoteSerialPacketType.Handshake:
        console.log('Handshake received', payload);
        this.sendBasicSerialPacket(SerialPacketType.Handshake, 0x0);
        this._updateState({ state: 'idle' });
        break;
      case RemoteSerialPacketType.HandshakeAck:
        console.log('Handshake ack received', payload);
        this._updateState({ state: 'idle' });
        break;
      case RemoteSerialPacketType.StartReaction:
        this._updateState({ state: 'running' });
        break;
      case RemoteSerialPacketType.EndReaction: {
        const timeInMicros =
          (payload[0] << 24) |
          (payload[1] << 16) |
          (payload[2] << 8) |
          payload[3];
        this._updateState({ state: 'finished', timeInMicros });
        break;
      }
      case RemoteSerialPacketType.EndReactionFailed:
        this._updateState({ state: 'failed' });
        break;
      case RemoteSerialPacketType.LightsOut:
        this._updateState({ state: 'lights-out' });
        break;
      default:
        console.log('Unknown packet type', packetType);
        this._updateState({ state: 'idle' });
    }
  }

  private _updateState(newState: SerialReactionTestState): void {
    if (newState.state === this._currentReactionTestState.state) return;
    const oldState = this._currentReactionTestState;
    this._currentReactionTestState = newState;

    this._stateChangeListeners.forEach((listener) =>
      listener(newState, oldState)
    );
  }

  public get currentReactionTestState(): SerialReactionTestState {
    return this._currentReactionTestState;
  }

  public addStateChangeListener(
    listener: (
      newState: SerialReactionTestState,
      oldState: SerialReactionTestState
    ) => void
  ): void {
    this._stateChangeListeners.push(listener);
  }
}
