import { ByteLengthParser, SerialPort } from 'serialport';

export enum RemoteSerialPacketType {
  StartReaction = 0x1,
  EndReaction = 0x2,
  EndReactionFailed = 0x3,
  Handshake = 0x69,
  HandshakeAck = 0x6a
}

export enum SerialPacketType {
  Handshake = 0x1
}

export type SerialReactionTestState =
  | {
      state: 'idle';
    }
  | {
      state: 'running';
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
/*
const port = new SerialPort({
  path: '/dev/cu.usbmodem11301',
  baudRate: 115200
});
const parser = port.pipe(new ByteLengthParser({ length: 5 }));

export const sendBasicSerialPacket = (
  packetType: SerialPacketType,
  data: number
): void => {
  const buffer = new Uint8Array(5);
  buffer[0] = packetType;
  buffer[1] = data >> 24;
  buffer[2] = data >> 16;
  buffer[3] = data >> 8;
  buffer[4] = data;
  port.write(buffer);
};

export const serialListen = () => {
  parser.on('data', (data: Buffer) => {
    const [packetType, ...payload] = data;
    switch (packetType as RemoteSerialPacketType) {
      case RemoteSerialPacketType.Handshake:
        console.log('Handshake received', payload);
        sendBasicSerialPacket(SerialPacketType.Handshake, 0x0);
        break;
      case RemoteSerialPacketType.HandshakeAck:
        console.log('Handshake ack received', payload);
        break;
      case RemoteSerialPacketType.StartReaction:
        console.log('Starting reactiont test...');
        break;
      case RemoteSerialPacketType.EndReaction: {
        const reactionTime =
          (payload[0] << 24) |
          (payload[1] << 16) |
          (payload[2] << 8) |
          payload[3];
        console.log(`Ending reaction test. Time was: ${reactionTime}ms`);
        break;
      }
      case RemoteSerialPacketType.EndReactionFailed:
        console.log('Ending reaction test failed');
        break;
      default:
        console.log('Unknown packet type', packetType);
    }
  });
};
*/
