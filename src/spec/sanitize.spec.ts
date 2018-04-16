import { sanitize, LoadEnv } from '../index';

describe('Environment Loader', () => {
  it('should load and validate throws no error', done => {
    class ProcessEnv {
      @LoadEnv({ default: 'gateway-island' }) 
      public SERVICE_NAME: string;
      @LoadEnv({ default: 'gateway-island', required: true })
      public USER: string;

      @LoadEnv()
      public NUMBER_WITH_NO_DEFAULT: number;
      @LoadEnv({ default: 5, required: true })
      public NUMBER_WITH_DEFAULT: number;
      @LoadEnv({ default: '5', required: true })
      public NUMBER_WITH_WRONG_DEFAULT: number;
      @LoadEnv({ default: '5A', required: true })
      public NUMBER_WITH_WRONG_DEFAULT2: number;
      @LoadEnv({ default: '011', required: true })
      public NUMBER_DEFAULT_IGNORE_8: number;
    };

    const pe = new ProcessEnv();
    console.log(`pre Object: \n${JSON.stringify(pe, null, 2)}`);
    sanitize(pe);
    console.log(`post Object: \n${JSON.stringify(pe, null, 2)}`);
    done();
  });

  class Constant {
    @LoadEnv({ default: 'xxx-island' })
    public SERVICE_NAME: string;

    public ISLAND_LOGGER_TYPE: 'short' | 'long' | 'json';
    public ISLAND_LOGGER_LEVEL: 'error' | 'warning' | 'debug' | 'info' | 'notice' | 'crit';

    @LoadEnv({ default: 'consul' })
    public CONSUL_HOST: string;
    @LoadEnv({ default: 8500 }) 
    public CONSUL_PORT: string;
    @LoadEnv()
    public CONSUL_NAMESPACE: string;
    @LoadEnv()
    public CONSUL_TOKEN: string;

    @LoadEnv({ default: 'amqp://rabbitmq:5672' })
    public RABBITMQ_HOST: string;

    @LoadEnv({ default: '' })
    public RABBITMQ_PUSH_HOST: string;
    @LoadEnv({})
    public RABBITMQ_RPC_HOST: string;
    @LoadEnv({ default: '' })
    public RABBITMQ_EVENT_HOST: string;

    @LoadEnv({ default: 100 })
    public RABBITMQ_POOLSIZE: number;

    @LoadEnv({ default: '' })
    public REDIS_AUTH: string;
    @LoadEnv({ default: 'redis' })
    public REDIS_HOST: string;
    @LoadEnv({ default: 6379 })
    public REDIS_PORT: number;

    @LoadEnv({ default: 'mongodb://mongodb:27017' })
    public MONGO_HOST: string;

    @LoadEnv({ default: false, required: true })
    public NO_REVIVER: boolean;
  }
  
  it('should load default island related values', done => {
    process.env.CONSUL_HOST = `I'm not consul`;

    const pe = new Constant();
    console.log(`pre Object: \n${JSON.stringify(pe, null, 2)}`);
    sanitize(pe);
    console.log(`post Object: \n${JSON.stringify(pe, null, 2)}`);
    done();
  });

  class ExtendedConstant extends Constant {
    @LoadEnv({ default: 'island' })
    public USER: string;
  }

  it('should inherit validator???', done => {

    const pe = new ExtendedConstant();
    console.log(`pre Object: \n${JSON.stringify(pe, null, 2)}`);
    sanitize(pe);
    console.log(`post Object: \n${JSON.stringify(pe, null, 2)}`);
    done();
  });

  afterAll(async done => {
    done();
  });
});
