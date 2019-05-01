enum DataType {
    Data = '$data',
    Session = '$session.$data',
    User = '$user.$data',
    App = '$app.$data',

    Input = '$inputs',
}

export interface DataParamMetaData {
    index: number;
    type: DataType;
    accessor?: string;
}

export const DataParamMetaDataKey = 'DataParamMetaData';

const createDataParamDecorator = (type: DataType) => {
    return (accessor?: string): ParameterDecorator => (target, key: string | symbol, index: number) => {
        const params: DataParamMetaData[] = Reflect.getMetadata(DataParamMetaDataKey, target, key) || [];
        params.unshift({
            index,
            type,
            accessor,
        });
        Reflect.defineMetadata(DataParamMetaDataKey, params, target, key);
    };
};

export const Data: (accessor?: string) => ParameterDecorator = createDataParamDecorator(
    DataType.Data,
);
export const RequestData = Data;

export const SessionData: (accessor?: string) => ParameterDecorator = createDataParamDecorator(
    DataType.Session,
);
export const Session = SessionData;

export const UserData: (accessor?: string) => ParameterDecorator = createDataParamDecorator(
    DataType.User,
);
export const User = UserData;

export const AppData: (accessor?: string) => ParameterDecorator = createDataParamDecorator(
    DataType.App,
);

export const InputData: (accessor?: string) => ParameterDecorator = createDataParamDecorator(
    DataType.Input,
);
