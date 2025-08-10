
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Query
 * 
 */
export type Query = $Result.DefaultSelection<Prisma.$QueryPayload>
/**
 * Model Case
 * 
 */
export type Case = $Result.DefaultSelection<Prisma.$CasePayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Encounter
 * 
 */
export type Encounter = $Result.DefaultSelection<Prisma.$EncounterPayload>
/**
 * Model Diagnosis
 * 
 */
export type Diagnosis = $Result.DefaultSelection<Prisma.$DiagnosisPayload>
/**
 * Model Procedure
 * 
 */
export type Procedure = $Result.DefaultSelection<Prisma.$ProcedurePayload>
/**
 * Model PreBillAnalysis
 * 
 */
export type PreBillAnalysis = $Result.DefaultSelection<Prisma.$PreBillAnalysisPayload>
/**
 * Model Denial
 * 
 */
export type Denial = $Result.DefaultSelection<Prisma.$DenialPayload>
/**
 * Model Analytics
 * 
 */
export type Analytics = $Result.DefaultSelection<Prisma.$AnalyticsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.query`: Exposes CRUD operations for the **Query** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Queries
    * const queries = await prisma.query.findMany()
    * ```
    */
  get query(): Prisma.QueryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.case`: Exposes CRUD operations for the **Case** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cases
    * const cases = await prisma.case.findMany()
    * ```
    */
  get case(): Prisma.CaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.encounter`: Exposes CRUD operations for the **Encounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Encounters
    * const encounters = await prisma.encounter.findMany()
    * ```
    */
  get encounter(): Prisma.EncounterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diagnosis`: Exposes CRUD operations for the **Diagnosis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Diagnoses
    * const diagnoses = await prisma.diagnosis.findMany()
    * ```
    */
  get diagnosis(): Prisma.DiagnosisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.procedure`: Exposes CRUD operations for the **Procedure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Procedures
    * const procedures = await prisma.procedure.findMany()
    * ```
    */
  get procedure(): Prisma.ProcedureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.preBillAnalysis`: Exposes CRUD operations for the **PreBillAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PreBillAnalyses
    * const preBillAnalyses = await prisma.preBillAnalysis.findMany()
    * ```
    */
  get preBillAnalysis(): Prisma.PreBillAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.denial`: Exposes CRUD operations for the **Denial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Denials
    * const denials = await prisma.denial.findMany()
    * ```
    */
  get denial(): Prisma.DenialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analytics`: Exposes CRUD operations for the **Analytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analytics
    * const analytics = await prisma.analytics.findMany()
    * ```
    */
  get analytics(): Prisma.AnalyticsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Query: 'Query',
    Case: 'Case',
    Patient: 'Patient',
    Encounter: 'Encounter',
    Diagnosis: 'Diagnosis',
    Procedure: 'Procedure',
    PreBillAnalysis: 'PreBillAnalysis',
    Denial: 'Denial',
    Analytics: 'Analytics'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "query" | "case" | "patient" | "encounter" | "diagnosis" | "procedure" | "preBillAnalysis" | "denial" | "analytics"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Query: {
        payload: Prisma.$QueryPayload<ExtArgs>
        fields: Prisma.QueryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QueryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QueryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          findFirst: {
            args: Prisma.QueryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QueryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          findMany: {
            args: Prisma.QueryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>[]
          }
          create: {
            args: Prisma.QueryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          createMany: {
            args: Prisma.QueryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QueryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          update: {
            args: Prisma.QueryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          deleteMany: {
            args: Prisma.QueryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QueryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QueryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueryPayload>
          }
          aggregate: {
            args: Prisma.QueryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuery>
          }
          groupBy: {
            args: Prisma.QueryGroupByArgs<ExtArgs>
            result: $Utils.Optional<QueryGroupByOutputType>[]
          }
          count: {
            args: Prisma.QueryCountArgs<ExtArgs>
            result: $Utils.Optional<QueryCountAggregateOutputType> | number
          }
        }
      }
      Case: {
        payload: Prisma.$CasePayload<ExtArgs>
        fields: Prisma.CaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findFirst: {
            args: Prisma.CaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          findMany: {
            args: Prisma.CaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>[]
          }
          create: {
            args: Prisma.CaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          createMany: {
            args: Prisma.CaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          update: {
            args: Prisma.CaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          deleteMany: {
            args: Prisma.CaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasePayload>
          }
          aggregate: {
            args: Prisma.CaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCase>
          }
          groupBy: {
            args: Prisma.CaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseCountArgs<ExtArgs>
            result: $Utils.Optional<CaseCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Encounter: {
        payload: Prisma.$EncounterPayload<ExtArgs>
        fields: Prisma.EncounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findFirst: {
            args: Prisma.EncounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findMany: {
            args: Prisma.EncounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          create: {
            args: Prisma.EncounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          createMany: {
            args: Prisma.EncounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EncounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          update: {
            args: Prisma.EncounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          deleteMany: {
            args: Prisma.EncounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EncounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          aggregate: {
            args: Prisma.EncounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounter>
          }
          groupBy: {
            args: Prisma.EncounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCountAggregateOutputType> | number
          }
        }
      }
      Diagnosis: {
        payload: Prisma.$DiagnosisPayload<ExtArgs>
        fields: Prisma.DiagnosisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiagnosisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiagnosisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          findFirst: {
            args: Prisma.DiagnosisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiagnosisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          findMany: {
            args: Prisma.DiagnosisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>[]
          }
          create: {
            args: Prisma.DiagnosisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          createMany: {
            args: Prisma.DiagnosisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DiagnosisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          update: {
            args: Prisma.DiagnosisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          deleteMany: {
            args: Prisma.DiagnosisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiagnosisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiagnosisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisPayload>
          }
          aggregate: {
            args: Prisma.DiagnosisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosis>
          }
          groupBy: {
            args: Prisma.DiagnosisGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiagnosisCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisCountAggregateOutputType> | number
          }
        }
      }
      Procedure: {
        payload: Prisma.$ProcedurePayload<ExtArgs>
        fields: Prisma.ProcedureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcedureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcedureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          findFirst: {
            args: Prisma.ProcedureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcedureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          findMany: {
            args: Prisma.ProcedureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>[]
          }
          create: {
            args: Prisma.ProcedureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          createMany: {
            args: Prisma.ProcedureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProcedureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          update: {
            args: Prisma.ProcedureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          deleteMany: {
            args: Prisma.ProcedureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcedureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProcedureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcedurePayload>
          }
          aggregate: {
            args: Prisma.ProcedureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcedure>
          }
          groupBy: {
            args: Prisma.ProcedureGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcedureGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcedureCountArgs<ExtArgs>
            result: $Utils.Optional<ProcedureCountAggregateOutputType> | number
          }
        }
      }
      PreBillAnalysis: {
        payload: Prisma.$PreBillAnalysisPayload<ExtArgs>
        fields: Prisma.PreBillAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PreBillAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PreBillAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          findFirst: {
            args: Prisma.PreBillAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PreBillAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          findMany: {
            args: Prisma.PreBillAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>[]
          }
          create: {
            args: Prisma.PreBillAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          createMany: {
            args: Prisma.PreBillAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PreBillAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          update: {
            args: Prisma.PreBillAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.PreBillAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PreBillAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PreBillAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PreBillAnalysisPayload>
          }
          aggregate: {
            args: Prisma.PreBillAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePreBillAnalysis>
          }
          groupBy: {
            args: Prisma.PreBillAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<PreBillAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.PreBillAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<PreBillAnalysisCountAggregateOutputType> | number
          }
        }
      }
      Denial: {
        payload: Prisma.$DenialPayload<ExtArgs>
        fields: Prisma.DenialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DenialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DenialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          findFirst: {
            args: Prisma.DenialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DenialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          findMany: {
            args: Prisma.DenialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>[]
          }
          create: {
            args: Prisma.DenialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          createMany: {
            args: Prisma.DenialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DenialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          update: {
            args: Prisma.DenialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          deleteMany: {
            args: Prisma.DenialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DenialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DenialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DenialPayload>
          }
          aggregate: {
            args: Prisma.DenialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDenial>
          }
          groupBy: {
            args: Prisma.DenialGroupByArgs<ExtArgs>
            result: $Utils.Optional<DenialGroupByOutputType>[]
          }
          count: {
            args: Prisma.DenialCountArgs<ExtArgs>
            result: $Utils.Optional<DenialCountAggregateOutputType> | number
          }
        }
      }
      Analytics: {
        payload: Prisma.$AnalyticsPayload<ExtArgs>
        fields: Prisma.AnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          findMany: {
            args: Prisma.AnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>[]
          }
          create: {
            args: Prisma.AnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          createMany: {
            args: Prisma.AnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          update: {
            args: Prisma.AnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalytics>
          }
          groupBy: {
            args: Prisma.AnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    query?: QueryOmit
    case?: CaseOmit
    patient?: PatientOmit
    encounter?: EncounterOmit
    diagnosis?: DiagnosisOmit
    procedure?: ProcedureOmit
    preBillAnalysis?: PreBillAnalysisOmit
    denial?: DenialOmit
    analytics?: AnalyticsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    queries: number
    assignedCases: number
    preBillAnalyses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queries?: boolean | UserCountOutputTypeCountQueriesArgs
    assignedCases?: boolean | UserCountOutputTypeCountAssignedCasesArgs
    preBillAnalyses?: boolean | UserCountOutputTypeCountPreBillAnalysesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountQueriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignedCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPreBillAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreBillAnalysisWhereInput
  }


  /**
   * Count Type CaseCountOutputType
   */

  export type CaseCountOutputType = {
    encounters: number
    denials: number
  }

  export type CaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | CaseCountOutputTypeCountEncountersArgs
    denials?: boolean | CaseCountOutputTypeCountDenialsArgs
  }

  // Custom InputTypes
  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseCountOutputType
     */
    select?: CaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }

  /**
   * CaseCountOutputType without action
   */
  export type CaseCountOutputTypeCountDenialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DenialWhereInput
  }


  /**
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    encounters: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | PatientCountOutputTypeCountEncountersArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }


  /**
   * Count Type EncounterCountOutputType
   */

  export type EncounterCountOutputType = {
    diagnoses: number
    procedures: number
    preBillAnalyses: number
  }

  export type EncounterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    diagnoses?: boolean | EncounterCountOutputTypeCountDiagnosesArgs
    procedures?: boolean | EncounterCountOutputTypeCountProceduresArgs
    preBillAnalyses?: boolean | EncounterCountOutputTypeCountPreBillAnalysesArgs
  }

  // Custom InputTypes
  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCountOutputType
     */
    select?: EncounterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountDiagnosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosisWhereInput
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountProceduresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcedureWhereInput
  }

  /**
   * EncounterCountOutputType without action
   */
  export type EncounterCountOutputTypeCountPreBillAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreBillAnalysisWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    fullName: string | null
    userRole: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    fullName: string | null
    userRole: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    role: number
    createdAt: number
    updatedAt: number
    fullName: number
    userRole: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    userRole?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    userRole?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    fullName?: true
    userRole?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
    fullName: string | null
    userRole: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    userRole?: boolean
    queries?: boolean | User$queriesArgs<ExtArgs>
    assignedCases?: boolean | User$assignedCasesArgs<ExtArgs>
    preBillAnalyses?: boolean | User$preBillAnalysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fullName?: boolean
    userRole?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "role" | "createdAt" | "updatedAt" | "fullName" | "userRole", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queries?: boolean | User$queriesArgs<ExtArgs>
    assignedCases?: boolean | User$assignedCasesArgs<ExtArgs>
    preBillAnalyses?: boolean | User$preBillAnalysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      queries: Prisma.$QueryPayload<ExtArgs>[]
      assignedCases: Prisma.$CasePayload<ExtArgs>[]
      preBillAnalyses: Prisma.$PreBillAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      role: string
      createdAt: Date
      updatedAt: Date
      fullName: string | null
      userRole: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    queries<T extends User$queriesArgs<ExtArgs> = {}>(args?: Subset<T, User$queriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assignedCases<T extends User$assignedCasesArgs<ExtArgs> = {}>(args?: Subset<T, User$assignedCasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preBillAnalyses<T extends User$preBillAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, User$preBillAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly userRole: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.queries
   */
  export type User$queriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    where?: QueryWhereInput
    orderBy?: QueryOrderByWithRelationInput | QueryOrderByWithRelationInput[]
    cursor?: QueryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QueryScalarFieldEnum | QueryScalarFieldEnum[]
  }

  /**
   * User.assignedCases
   */
  export type User$assignedCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    cursor?: CaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * User.preBillAnalyses
   */
  export type User$preBillAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    where?: PreBillAnalysisWhereInput
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    cursor?: PreBillAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PreBillAnalysisScalarFieldEnum | PreBillAnalysisScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Query
   */

  export type AggregateQuery = {
    _count: QueryCountAggregateOutputType | null
    _avg: QueryAvgAggregateOutputType | null
    _sum: QuerySumAggregateOutputType | null
    _min: QueryMinAggregateOutputType | null
    _max: QueryMaxAggregateOutputType | null
  }

  export type QueryAvgAggregateOutputType = {
    confidence: number | null
  }

  export type QuerySumAggregateOutputType = {
    confidence: number | null
  }

  export type QueryMinAggregateOutputType = {
    id: string | null
    question: string | null
    answer: string | null
    confidence: number | null
    sources: string | null
    status: string | null
    context: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QueryMaxAggregateOutputType = {
    id: string | null
    question: string | null
    answer: string | null
    confidence: number | null
    sources: string | null
    status: string | null
    context: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QueryCountAggregateOutputType = {
    id: number
    question: number
    answer: number
    confidence: number
    sources: number
    status: number
    context: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QueryAvgAggregateInputType = {
    confidence?: true
  }

  export type QuerySumAggregateInputType = {
    confidence?: true
  }

  export type QueryMinAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    confidence?: true
    sources?: true
    status?: true
    context?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QueryMaxAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    confidence?: true
    sources?: true
    status?: true
    context?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QueryCountAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    confidence?: true
    sources?: true
    status?: true
    context?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QueryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Query to aggregate.
     */
    where?: QueryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queries to fetch.
     */
    orderBy?: QueryOrderByWithRelationInput | QueryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QueryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Queries
    **/
    _count?: true | QueryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QueryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuerySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QueryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QueryMaxAggregateInputType
  }

  export type GetQueryAggregateType<T extends QueryAggregateArgs> = {
        [P in keyof T & keyof AggregateQuery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuery[P]>
      : GetScalarType<T[P], AggregateQuery[P]>
  }




  export type QueryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueryWhereInput
    orderBy?: QueryOrderByWithAggregationInput | QueryOrderByWithAggregationInput[]
    by: QueryScalarFieldEnum[] | QueryScalarFieldEnum
    having?: QueryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QueryCountAggregateInputType | true
    _avg?: QueryAvgAggregateInputType
    _sum?: QuerySumAggregateInputType
    _min?: QueryMinAggregateInputType
    _max?: QueryMaxAggregateInputType
  }

  export type QueryGroupByOutputType = {
    id: string
    question: string
    answer: string | null
    confidence: number | null
    sources: string | null
    status: string
    context: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: QueryCountAggregateOutputType | null
    _avg: QueryAvgAggregateOutputType | null
    _sum: QuerySumAggregateOutputType | null
    _min: QueryMinAggregateOutputType | null
    _max: QueryMaxAggregateOutputType | null
  }

  type GetQueryGroupByPayload<T extends QueryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QueryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QueryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QueryGroupByOutputType[P]>
            : GetScalarType<T[P], QueryGroupByOutputType[P]>
        }
      >
    >


  export type QuerySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    answer?: boolean
    confidence?: boolean
    sources?: boolean
    status?: boolean
    context?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["query"]>



  export type QuerySelectScalar = {
    id?: boolean
    question?: boolean
    answer?: boolean
    confidence?: boolean
    sources?: boolean
    status?: boolean
    context?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QueryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "answer" | "confidence" | "sources" | "status" | "context" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["query"]>
  export type QueryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $QueryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Query"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question: string
      answer: string | null
      confidence: number | null
      sources: string | null
      status: string
      context: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["query"]>
    composites: {}
  }

  type QueryGetPayload<S extends boolean | null | undefined | QueryDefaultArgs> = $Result.GetResult<Prisma.$QueryPayload, S>

  type QueryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QueryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QueryCountAggregateInputType | true
    }

  export interface QueryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Query'], meta: { name: 'Query' } }
    /**
     * Find zero or one Query that matches the filter.
     * @param {QueryFindUniqueArgs} args - Arguments to find a Query
     * @example
     * // Get one Query
     * const query = await prisma.query.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QueryFindUniqueArgs>(args: SelectSubset<T, QueryFindUniqueArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Query that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QueryFindUniqueOrThrowArgs} args - Arguments to find a Query
     * @example
     * // Get one Query
     * const query = await prisma.query.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QueryFindUniqueOrThrowArgs>(args: SelectSubset<T, QueryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Query that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryFindFirstArgs} args - Arguments to find a Query
     * @example
     * // Get one Query
     * const query = await prisma.query.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QueryFindFirstArgs>(args?: SelectSubset<T, QueryFindFirstArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Query that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryFindFirstOrThrowArgs} args - Arguments to find a Query
     * @example
     * // Get one Query
     * const query = await prisma.query.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QueryFindFirstOrThrowArgs>(args?: SelectSubset<T, QueryFindFirstOrThrowArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Queries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Queries
     * const queries = await prisma.query.findMany()
     * 
     * // Get first 10 Queries
     * const queries = await prisma.query.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const queryWithIdOnly = await prisma.query.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QueryFindManyArgs>(args?: SelectSubset<T, QueryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Query.
     * @param {QueryCreateArgs} args - Arguments to create a Query.
     * @example
     * // Create one Query
     * const Query = await prisma.query.create({
     *   data: {
     *     // ... data to create a Query
     *   }
     * })
     * 
     */
    create<T extends QueryCreateArgs>(args: SelectSubset<T, QueryCreateArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Queries.
     * @param {QueryCreateManyArgs} args - Arguments to create many Queries.
     * @example
     * // Create many Queries
     * const query = await prisma.query.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QueryCreateManyArgs>(args?: SelectSubset<T, QueryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Query.
     * @param {QueryDeleteArgs} args - Arguments to delete one Query.
     * @example
     * // Delete one Query
     * const Query = await prisma.query.delete({
     *   where: {
     *     // ... filter to delete one Query
     *   }
     * })
     * 
     */
    delete<T extends QueryDeleteArgs>(args: SelectSubset<T, QueryDeleteArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Query.
     * @param {QueryUpdateArgs} args - Arguments to update one Query.
     * @example
     * // Update one Query
     * const query = await prisma.query.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QueryUpdateArgs>(args: SelectSubset<T, QueryUpdateArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Queries.
     * @param {QueryDeleteManyArgs} args - Arguments to filter Queries to delete.
     * @example
     * // Delete a few Queries
     * const { count } = await prisma.query.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QueryDeleteManyArgs>(args?: SelectSubset<T, QueryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Queries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Queries
     * const query = await prisma.query.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QueryUpdateManyArgs>(args: SelectSubset<T, QueryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Query.
     * @param {QueryUpsertArgs} args - Arguments to update or create a Query.
     * @example
     * // Update or create a Query
     * const query = await prisma.query.upsert({
     *   create: {
     *     // ... data to create a Query
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Query we want to update
     *   }
     * })
     */
    upsert<T extends QueryUpsertArgs>(args: SelectSubset<T, QueryUpsertArgs<ExtArgs>>): Prisma__QueryClient<$Result.GetResult<Prisma.$QueryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Queries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryCountArgs} args - Arguments to filter Queries to count.
     * @example
     * // Count the number of Queries
     * const count = await prisma.query.count({
     *   where: {
     *     // ... the filter for the Queries we want to count
     *   }
     * })
    **/
    count<T extends QueryCountArgs>(
      args?: Subset<T, QueryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QueryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Query.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QueryAggregateArgs>(args: Subset<T, QueryAggregateArgs>): Prisma.PrismaPromise<GetQueryAggregateType<T>>

    /**
     * Group by Query.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QueryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QueryGroupByArgs['orderBy'] }
        : { orderBy?: QueryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QueryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQueryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Query model
   */
  readonly fields: QueryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Query.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QueryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Query model
   */
  interface QueryFieldRefs {
    readonly id: FieldRef<"Query", 'String'>
    readonly question: FieldRef<"Query", 'String'>
    readonly answer: FieldRef<"Query", 'String'>
    readonly confidence: FieldRef<"Query", 'Float'>
    readonly sources: FieldRef<"Query", 'String'>
    readonly status: FieldRef<"Query", 'String'>
    readonly context: FieldRef<"Query", 'String'>
    readonly userId: FieldRef<"Query", 'String'>
    readonly createdAt: FieldRef<"Query", 'DateTime'>
    readonly updatedAt: FieldRef<"Query", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Query findUnique
   */
  export type QueryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter, which Query to fetch.
     */
    where: QueryWhereUniqueInput
  }

  /**
   * Query findUniqueOrThrow
   */
  export type QueryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter, which Query to fetch.
     */
    where: QueryWhereUniqueInput
  }

  /**
   * Query findFirst
   */
  export type QueryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter, which Query to fetch.
     */
    where?: QueryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queries to fetch.
     */
    orderBy?: QueryOrderByWithRelationInput | QueryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Queries.
     */
    cursor?: QueryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Queries.
     */
    distinct?: QueryScalarFieldEnum | QueryScalarFieldEnum[]
  }

  /**
   * Query findFirstOrThrow
   */
  export type QueryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter, which Query to fetch.
     */
    where?: QueryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queries to fetch.
     */
    orderBy?: QueryOrderByWithRelationInput | QueryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Queries.
     */
    cursor?: QueryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Queries.
     */
    distinct?: QueryScalarFieldEnum | QueryScalarFieldEnum[]
  }

  /**
   * Query findMany
   */
  export type QueryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter, which Queries to fetch.
     */
    where?: QueryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queries to fetch.
     */
    orderBy?: QueryOrderByWithRelationInput | QueryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Queries.
     */
    cursor?: QueryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queries.
     */
    skip?: number
    distinct?: QueryScalarFieldEnum | QueryScalarFieldEnum[]
  }

  /**
   * Query create
   */
  export type QueryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * The data needed to create a Query.
     */
    data: XOR<QueryCreateInput, QueryUncheckedCreateInput>
  }

  /**
   * Query createMany
   */
  export type QueryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Queries.
     */
    data: QueryCreateManyInput | QueryCreateManyInput[]
  }

  /**
   * Query update
   */
  export type QueryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * The data needed to update a Query.
     */
    data: XOR<QueryUpdateInput, QueryUncheckedUpdateInput>
    /**
     * Choose, which Query to update.
     */
    where: QueryWhereUniqueInput
  }

  /**
   * Query updateMany
   */
  export type QueryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Queries.
     */
    data: XOR<QueryUpdateManyMutationInput, QueryUncheckedUpdateManyInput>
    /**
     * Filter which Queries to update
     */
    where?: QueryWhereInput
    /**
     * Limit how many Queries to update.
     */
    limit?: number
  }

  /**
   * Query upsert
   */
  export type QueryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * The filter to search for the Query to update in case it exists.
     */
    where: QueryWhereUniqueInput
    /**
     * In case the Query found by the `where` argument doesn't exist, create a new Query with this data.
     */
    create: XOR<QueryCreateInput, QueryUncheckedCreateInput>
    /**
     * In case the Query was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QueryUpdateInput, QueryUncheckedUpdateInput>
  }

  /**
   * Query delete
   */
  export type QueryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
    /**
     * Filter which Query to delete.
     */
    where: QueryWhereUniqueInput
  }

  /**
   * Query deleteMany
   */
  export type QueryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Queries to delete
     */
    where?: QueryWhereInput
    /**
     * Limit how many Queries to delete.
     */
    limit?: number
  }

  /**
   * Query without action
   */
  export type QueryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Query
     */
    select?: QuerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Query
     */
    omit?: QueryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueryInclude<ExtArgs> | null
  }


  /**
   * Model Case
   */

  export type AggregateCase = {
    _count: CaseCountAggregateOutputType | null
    _avg: CaseAvgAggregateOutputType | null
    _sum: CaseSumAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  export type CaseAvgAggregateOutputType = {
    age: number | null
  }

  export type CaseSumAggregateOutputType = {
    age: number | null
  }

  export type CaseMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    priority: string | null
    assignedUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    patientFhirId: string | null
    encounterFhirId: string | null
    medicalRecordNumber: string | null
    patientName: string | null
    age: number | null
    gender: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    primaryDiagnosis: string | null
    currentDRG: string | null
    openDate: Date | null
    closeDate: Date | null
    facilityId: string | null
  }

  export type CaseMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    priority: string | null
    assignedUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    patientFhirId: string | null
    encounterFhirId: string | null
    medicalRecordNumber: string | null
    patientName: string | null
    age: number | null
    gender: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    primaryDiagnosis: string | null
    currentDRG: string | null
    openDate: Date | null
    closeDate: Date | null
    facilityId: string | null
  }

  export type CaseCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    priority: number
    assignedUserId: number
    createdAt: number
    updatedAt: number
    patientFhirId: number
    encounterFhirId: number
    medicalRecordNumber: number
    patientName: number
    age: number
    gender: number
    admissionDate: number
    dischargeDate: number
    primaryDiagnosis: number
    currentDRG: number
    openDate: number
    closeDate: number
    facilityId: number
    _all: number
  }


  export type CaseAvgAggregateInputType = {
    age?: true
  }

  export type CaseSumAggregateInputType = {
    age?: true
  }

  export type CaseMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    assignedUserId?: true
    createdAt?: true
    updatedAt?: true
    patientFhirId?: true
    encounterFhirId?: true
    medicalRecordNumber?: true
    patientName?: true
    age?: true
    gender?: true
    admissionDate?: true
    dischargeDate?: true
    primaryDiagnosis?: true
    currentDRG?: true
    openDate?: true
    closeDate?: true
    facilityId?: true
  }

  export type CaseMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    assignedUserId?: true
    createdAt?: true
    updatedAt?: true
    patientFhirId?: true
    encounterFhirId?: true
    medicalRecordNumber?: true
    patientName?: true
    age?: true
    gender?: true
    admissionDate?: true
    dischargeDate?: true
    primaryDiagnosis?: true
    currentDRG?: true
    openDate?: true
    closeDate?: true
    facilityId?: true
  }

  export type CaseCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    assignedUserId?: true
    createdAt?: true
    updatedAt?: true
    patientFhirId?: true
    encounterFhirId?: true
    medicalRecordNumber?: true
    patientName?: true
    age?: true
    gender?: true
    admissionDate?: true
    dischargeDate?: true
    primaryDiagnosis?: true
    currentDRG?: true
    openDate?: true
    closeDate?: true
    facilityId?: true
    _all?: true
  }

  export type CaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Case to aggregate.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cases
    **/
    _count?: true | CaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseMaxAggregateInputType
  }

  export type GetCaseAggregateType<T extends CaseAggregateArgs> = {
        [P in keyof T & keyof AggregateCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCase[P]>
      : GetScalarType<T[P], AggregateCase[P]>
  }




  export type CaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseWhereInput
    orderBy?: CaseOrderByWithAggregationInput | CaseOrderByWithAggregationInput[]
    by: CaseScalarFieldEnum[] | CaseScalarFieldEnum
    having?: CaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseCountAggregateInputType | true
    _avg?: CaseAvgAggregateInputType
    _sum?: CaseSumAggregateInputType
    _min?: CaseMinAggregateInputType
    _max?: CaseMaxAggregateInputType
  }

  export type CaseGroupByOutputType = {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    assignedUserId: string | null
    createdAt: Date
    updatedAt: Date
    patientFhirId: string | null
    encounterFhirId: string | null
    medicalRecordNumber: string | null
    patientName: string | null
    age: number | null
    gender: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    primaryDiagnosis: string | null
    currentDRG: string | null
    openDate: Date | null
    closeDate: Date | null
    facilityId: string | null
    _count: CaseCountAggregateOutputType | null
    _avg: CaseAvgAggregateOutputType | null
    _sum: CaseSumAggregateOutputType | null
    _min: CaseMinAggregateOutputType | null
    _max: CaseMaxAggregateOutputType | null
  }

  type GetCaseGroupByPayload<T extends CaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseGroupByOutputType[P]>
            : GetScalarType<T[P], CaseGroupByOutputType[P]>
        }
      >
    >


  export type CaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    priority?: boolean
    assignedUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patientFhirId?: boolean
    encounterFhirId?: boolean
    medicalRecordNumber?: boolean
    patientName?: boolean
    age?: boolean
    gender?: boolean
    admissionDate?: boolean
    dischargeDate?: boolean
    primaryDiagnosis?: boolean
    currentDRG?: boolean
    openDate?: boolean
    closeDate?: boolean
    facilityId?: boolean
    assignedUser?: boolean | Case$assignedUserArgs<ExtArgs>
    encounters?: boolean | Case$encountersArgs<ExtArgs>
    denials?: boolean | Case$denialsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["case"]>



  export type CaseSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    priority?: boolean
    assignedUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patientFhirId?: boolean
    encounterFhirId?: boolean
    medicalRecordNumber?: boolean
    patientName?: boolean
    age?: boolean
    gender?: boolean
    admissionDate?: boolean
    dischargeDate?: boolean
    primaryDiagnosis?: boolean
    currentDRG?: boolean
    openDate?: boolean
    closeDate?: boolean
    facilityId?: boolean
  }

  export type CaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "status" | "priority" | "assignedUserId" | "createdAt" | "updatedAt" | "patientFhirId" | "encounterFhirId" | "medicalRecordNumber" | "patientName" | "age" | "gender" | "admissionDate" | "dischargeDate" | "primaryDiagnosis" | "currentDRG" | "openDate" | "closeDate" | "facilityId", ExtArgs["result"]["case"]>
  export type CaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedUser?: boolean | Case$assignedUserArgs<ExtArgs>
    encounters?: boolean | Case$encountersArgs<ExtArgs>
    denials?: boolean | Case$denialsArgs<ExtArgs>
    _count?: boolean | CaseCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Case"
    objects: {
      assignedUser: Prisma.$UserPayload<ExtArgs> | null
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
      denials: Prisma.$DenialPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      status: string
      priority: string
      assignedUserId: string | null
      createdAt: Date
      updatedAt: Date
      patientFhirId: string | null
      encounterFhirId: string | null
      medicalRecordNumber: string | null
      patientName: string | null
      age: number | null
      gender: string | null
      admissionDate: Date | null
      dischargeDate: Date | null
      primaryDiagnosis: string | null
      currentDRG: string | null
      openDate: Date | null
      closeDate: Date | null
      facilityId: string | null
    }, ExtArgs["result"]["case"]>
    composites: {}
  }

  type CaseGetPayload<S extends boolean | null | undefined | CaseDefaultArgs> = $Result.GetResult<Prisma.$CasePayload, S>

  type CaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseCountAggregateInputType | true
    }

  export interface CaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Case'], meta: { name: 'Case' } }
    /**
     * Find zero or one Case that matches the filter.
     * @param {CaseFindUniqueArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseFindUniqueArgs>(args: SelectSubset<T, CaseFindUniqueArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Case that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseFindUniqueOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseFindFirstArgs>(args?: SelectSubset<T, CaseFindFirstArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Case that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindFirstOrThrowArgs} args - Arguments to find a Case
     * @example
     * // Get one Case
     * const case = await prisma.case.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cases
     * const cases = await prisma.case.findMany()
     * 
     * // Get first 10 Cases
     * const cases = await prisma.case.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseWithIdOnly = await prisma.case.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseFindManyArgs>(args?: SelectSubset<T, CaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Case.
     * @param {CaseCreateArgs} args - Arguments to create a Case.
     * @example
     * // Create one Case
     * const Case = await prisma.case.create({
     *   data: {
     *     // ... data to create a Case
     *   }
     * })
     * 
     */
    create<T extends CaseCreateArgs>(args: SelectSubset<T, CaseCreateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cases.
     * @param {CaseCreateManyArgs} args - Arguments to create many Cases.
     * @example
     * // Create many Cases
     * const case = await prisma.case.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseCreateManyArgs>(args?: SelectSubset<T, CaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Case.
     * @param {CaseDeleteArgs} args - Arguments to delete one Case.
     * @example
     * // Delete one Case
     * const Case = await prisma.case.delete({
     *   where: {
     *     // ... filter to delete one Case
     *   }
     * })
     * 
     */
    delete<T extends CaseDeleteArgs>(args: SelectSubset<T, CaseDeleteArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Case.
     * @param {CaseUpdateArgs} args - Arguments to update one Case.
     * @example
     * // Update one Case
     * const case = await prisma.case.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseUpdateArgs>(args: SelectSubset<T, CaseUpdateArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cases.
     * @param {CaseDeleteManyArgs} args - Arguments to filter Cases to delete.
     * @example
     * // Delete a few Cases
     * const { count } = await prisma.case.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseDeleteManyArgs>(args?: SelectSubset<T, CaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cases
     * const case = await prisma.case.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseUpdateManyArgs>(args: SelectSubset<T, CaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Case.
     * @param {CaseUpsertArgs} args - Arguments to update or create a Case.
     * @example
     * // Update or create a Case
     * const case = await prisma.case.upsert({
     *   create: {
     *     // ... data to create a Case
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Case we want to update
     *   }
     * })
     */
    upsert<T extends CaseUpsertArgs>(args: SelectSubset<T, CaseUpsertArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseCountArgs} args - Arguments to filter Cases to count.
     * @example
     * // Count the number of Cases
     * const count = await prisma.case.count({
     *   where: {
     *     // ... the filter for the Cases we want to count
     *   }
     * })
    **/
    count<T extends CaseCountArgs>(
      args?: Subset<T, CaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseAggregateArgs>(args: Subset<T, CaseAggregateArgs>): Prisma.PrismaPromise<GetCaseAggregateType<T>>

    /**
     * Group by Case.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseGroupByArgs['orderBy'] }
        : { orderBy?: CaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Case model
   */
  readonly fields: CaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Case.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignedUser<T extends Case$assignedUserArgs<ExtArgs> = {}>(args?: Subset<T, Case$assignedUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    encounters<T extends Case$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Case$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    denials<T extends Case$denialsArgs<ExtArgs> = {}>(args?: Subset<T, Case$denialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Case model
   */
  interface CaseFieldRefs {
    readonly id: FieldRef<"Case", 'String'>
    readonly title: FieldRef<"Case", 'String'>
    readonly description: FieldRef<"Case", 'String'>
    readonly status: FieldRef<"Case", 'String'>
    readonly priority: FieldRef<"Case", 'String'>
    readonly assignedUserId: FieldRef<"Case", 'String'>
    readonly createdAt: FieldRef<"Case", 'DateTime'>
    readonly updatedAt: FieldRef<"Case", 'DateTime'>
    readonly patientFhirId: FieldRef<"Case", 'String'>
    readonly encounterFhirId: FieldRef<"Case", 'String'>
    readonly medicalRecordNumber: FieldRef<"Case", 'String'>
    readonly patientName: FieldRef<"Case", 'String'>
    readonly age: FieldRef<"Case", 'Int'>
    readonly gender: FieldRef<"Case", 'String'>
    readonly admissionDate: FieldRef<"Case", 'DateTime'>
    readonly dischargeDate: FieldRef<"Case", 'DateTime'>
    readonly primaryDiagnosis: FieldRef<"Case", 'String'>
    readonly currentDRG: FieldRef<"Case", 'String'>
    readonly openDate: FieldRef<"Case", 'DateTime'>
    readonly closeDate: FieldRef<"Case", 'DateTime'>
    readonly facilityId: FieldRef<"Case", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Case findUnique
   */
  export type CaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findUniqueOrThrow
   */
  export type CaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case findFirst
   */
  export type CaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findFirstOrThrow
   */
  export type CaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Case to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cases.
     */
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case findMany
   */
  export type CaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter, which Cases to fetch.
     */
    where?: CaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cases to fetch.
     */
    orderBy?: CaseOrderByWithRelationInput | CaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cases.
     */
    cursor?: CaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cases.
     */
    skip?: number
    distinct?: CaseScalarFieldEnum | CaseScalarFieldEnum[]
  }

  /**
   * Case create
   */
  export type CaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Case.
     */
    data: XOR<CaseCreateInput, CaseUncheckedCreateInput>
  }

  /**
   * Case createMany
   */
  export type CaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cases.
     */
    data: CaseCreateManyInput | CaseCreateManyInput[]
  }

  /**
   * Case update
   */
  export type CaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Case.
     */
    data: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
    /**
     * Choose, which Case to update.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case updateMany
   */
  export type CaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cases.
     */
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyInput>
    /**
     * Filter which Cases to update
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to update.
     */
    limit?: number
  }

  /**
   * Case upsert
   */
  export type CaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Case to update in case it exists.
     */
    where: CaseWhereUniqueInput
    /**
     * In case the Case found by the `where` argument doesn't exist, create a new Case with this data.
     */
    create: XOR<CaseCreateInput, CaseUncheckedCreateInput>
    /**
     * In case the Case was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseUpdateInput, CaseUncheckedUpdateInput>
  }

  /**
   * Case delete
   */
  export type CaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    /**
     * Filter which Case to delete.
     */
    where: CaseWhereUniqueInput
  }

  /**
   * Case deleteMany
   */
  export type CaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cases to delete
     */
    where?: CaseWhereInput
    /**
     * Limit how many Cases to delete.
     */
    limit?: number
  }

  /**
   * Case.assignedUser
   */
  export type Case$assignedUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Case.encounters
   */
  export type Case$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Case.denials
   */
  export type Case$denialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    where?: DenialWhereInput
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    cursor?: DenialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Case without action
   */
  export type CaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    name: string | null
    mrn: string | null
    dob: Date | null
    gender: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    mrn: string | null
    dob: Date | null
    gender: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    name: number
    mrn: number
    dob: number
    gender: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    name?: true
    mrn?: true
    dob?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    name?: true
    mrn?: true
    dob?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    name?: true
    mrn?: true
    dob?: true
    gender?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    name: string
    mrn: string
    dob: Date | null
    gender: string | null
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    mrn?: boolean
    dob?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>



  export type PatientSelectScalar = {
    id?: boolean
    name?: boolean
    mrn?: boolean
    dob?: boolean
    gender?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "mrn" | "dob" | "gender" | "createdAt" | "updatedAt", ExtArgs["result"]["patient"]>
  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      mrn: string
      dob: Date | null
      gender: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    encounters<T extends Patient$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Patient$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly name: FieldRef<"Patient", 'String'>
    readonly mrn: FieldRef<"Patient", 'String'>
    readonly dob: FieldRef<"Patient", 'DateTime'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient.encounters
   */
  export type Patient$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model Encounter
   */

  export type AggregateEncounter = {
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  export type EncounterMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    caseId: string | null
    encounterId: string | null
    chiefComplaint: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    caseId: string | null
    encounterId: string | null
    chiefComplaint: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterCountAggregateOutputType = {
    id: number
    patientId: number
    caseId: number
    encounterId: number
    chiefComplaint: number
    admissionDate: number
    dischargeDate: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EncounterMinAggregateInputType = {
    id?: true
    patientId?: true
    caseId?: true
    encounterId?: true
    chiefComplaint?: true
    admissionDate?: true
    dischargeDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterMaxAggregateInputType = {
    id?: true
    patientId?: true
    caseId?: true
    encounterId?: true
    chiefComplaint?: true
    admissionDate?: true
    dischargeDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterCountAggregateInputType = {
    id?: true
    patientId?: true
    caseId?: true
    encounterId?: true
    chiefComplaint?: true
    admissionDate?: true
    dischargeDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EncounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounter to aggregate.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Encounters
    **/
    _count?: true | EncounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterMaxAggregateInputType
  }

  export type GetEncounterAggregateType<T extends EncounterAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounter[P]>
      : GetScalarType<T[P], AggregateEncounter[P]>
  }




  export type EncounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithAggregationInput | EncounterOrderByWithAggregationInput[]
    by: EncounterScalarFieldEnum[] | EncounterScalarFieldEnum
    having?: EncounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCountAggregateInputType | true
    _min?: EncounterMinAggregateInputType
    _max?: EncounterMaxAggregateInputType
  }

  export type EncounterGroupByOutputType = {
    id: string
    patientId: string
    caseId: string | null
    encounterId: string
    chiefComplaint: string | null
    admissionDate: Date | null
    dischargeDate: Date | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  type GetEncounterGroupByPayload<T extends EncounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterGroupByOutputType[P]>
        }
      >
    >


  export type EncounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    caseId?: boolean
    encounterId?: boolean
    chiefComplaint?: boolean
    admissionDate?: boolean
    dischargeDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    case?: boolean | Encounter$caseArgs<ExtArgs>
    diagnoses?: boolean | Encounter$diagnosesArgs<ExtArgs>
    procedures?: boolean | Encounter$proceduresArgs<ExtArgs>
    preBillAnalyses?: boolean | Encounter$preBillAnalysesArgs<ExtArgs>
    _count?: boolean | EncounterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>



  export type EncounterSelectScalar = {
    id?: boolean
    patientId?: boolean
    caseId?: boolean
    encounterId?: boolean
    chiefComplaint?: boolean
    admissionDate?: boolean
    dischargeDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EncounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "caseId" | "encounterId" | "chiefComplaint" | "admissionDate" | "dischargeDate" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["encounter"]>
  export type EncounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    case?: boolean | Encounter$caseArgs<ExtArgs>
    diagnoses?: boolean | Encounter$diagnosesArgs<ExtArgs>
    procedures?: boolean | Encounter$proceduresArgs<ExtArgs>
    preBillAnalyses?: boolean | Encounter$preBillAnalysesArgs<ExtArgs>
    _count?: boolean | EncounterCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $EncounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Encounter"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      case: Prisma.$CasePayload<ExtArgs> | null
      diagnoses: Prisma.$DiagnosisPayload<ExtArgs>[]
      procedures: Prisma.$ProcedurePayload<ExtArgs>[]
      preBillAnalyses: Prisma.$PreBillAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      caseId: string | null
      encounterId: string
      chiefComplaint: string | null
      admissionDate: Date | null
      dischargeDate: Date | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["encounter"]>
    composites: {}
  }

  type EncounterGetPayload<S extends boolean | null | undefined | EncounterDefaultArgs> = $Result.GetResult<Prisma.$EncounterPayload, S>

  type EncounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EncounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EncounterCountAggregateInputType | true
    }

  export interface EncounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Encounter'], meta: { name: 'Encounter' } }
    /**
     * Find zero or one Encounter that matches the filter.
     * @param {EncounterFindUniqueArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterFindUniqueArgs>(args: SelectSubset<T, EncounterFindUniqueArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Encounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EncounterFindUniqueOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterFindFirstArgs>(args?: SelectSubset<T, EncounterFindFirstArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Encounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Encounters
     * const encounters = await prisma.encounter.findMany()
     * 
     * // Get first 10 Encounters
     * const encounters = await prisma.encounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterWithIdOnly = await prisma.encounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterFindManyArgs>(args?: SelectSubset<T, EncounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Encounter.
     * @param {EncounterCreateArgs} args - Arguments to create a Encounter.
     * @example
     * // Create one Encounter
     * const Encounter = await prisma.encounter.create({
     *   data: {
     *     // ... data to create a Encounter
     *   }
     * })
     * 
     */
    create<T extends EncounterCreateArgs>(args: SelectSubset<T, EncounterCreateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Encounters.
     * @param {EncounterCreateManyArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCreateManyArgs>(args?: SelectSubset<T, EncounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Encounter.
     * @param {EncounterDeleteArgs} args - Arguments to delete one Encounter.
     * @example
     * // Delete one Encounter
     * const Encounter = await prisma.encounter.delete({
     *   where: {
     *     // ... filter to delete one Encounter
     *   }
     * })
     * 
     */
    delete<T extends EncounterDeleteArgs>(args: SelectSubset<T, EncounterDeleteArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Encounter.
     * @param {EncounterUpdateArgs} args - Arguments to update one Encounter.
     * @example
     * // Update one Encounter
     * const encounter = await prisma.encounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterUpdateArgs>(args: SelectSubset<T, EncounterUpdateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Encounters.
     * @param {EncounterDeleteManyArgs} args - Arguments to filter Encounters to delete.
     * @example
     * // Delete a few Encounters
     * const { count } = await prisma.encounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterDeleteManyArgs>(args?: SelectSubset<T, EncounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterUpdateManyArgs>(args: SelectSubset<T, EncounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Encounter.
     * @param {EncounterUpsertArgs} args - Arguments to update or create a Encounter.
     * @example
     * // Update or create a Encounter
     * const encounter = await prisma.encounter.upsert({
     *   create: {
     *     // ... data to create a Encounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Encounter we want to update
     *   }
     * })
     */
    upsert<T extends EncounterUpsertArgs>(args: SelectSubset<T, EncounterUpsertArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCountArgs} args - Arguments to filter Encounters to count.
     * @example
     * // Count the number of Encounters
     * const count = await prisma.encounter.count({
     *   where: {
     *     // ... the filter for the Encounters we want to count
     *   }
     * })
    **/
    count<T extends EncounterCountArgs>(
      args?: Subset<T, EncounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EncounterAggregateArgs>(args: Subset<T, EncounterAggregateArgs>): Prisma.PrismaPromise<GetEncounterAggregateType<T>>

    /**
     * Group by Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EncounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterGroupByArgs['orderBy'] }
        : { orderBy?: EncounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EncounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Encounter model
   */
  readonly fields: EncounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Encounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    case<T extends Encounter$caseArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$caseArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    diagnoses<T extends Encounter$diagnosesArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$diagnosesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    procedures<T extends Encounter$proceduresArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$proceduresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preBillAnalyses<T extends Encounter$preBillAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$preBillAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Encounter model
   */
  interface EncounterFieldRefs {
    readonly id: FieldRef<"Encounter", 'String'>
    readonly patientId: FieldRef<"Encounter", 'String'>
    readonly caseId: FieldRef<"Encounter", 'String'>
    readonly encounterId: FieldRef<"Encounter", 'String'>
    readonly chiefComplaint: FieldRef<"Encounter", 'String'>
    readonly admissionDate: FieldRef<"Encounter", 'DateTime'>
    readonly dischargeDate: FieldRef<"Encounter", 'DateTime'>
    readonly status: FieldRef<"Encounter", 'String'>
    readonly createdAt: FieldRef<"Encounter", 'DateTime'>
    readonly updatedAt: FieldRef<"Encounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Encounter findUnique
   */
  export type EncounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findUniqueOrThrow
   */
  export type EncounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findFirst
   */
  export type EncounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findFirstOrThrow
   */
  export type EncounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findMany
   */
  export type EncounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounters to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter create
   */
  export type EncounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to create a Encounter.
     */
    data: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
  }

  /**
   * Encounter createMany
   */
  export type EncounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
  }

  /**
   * Encounter update
   */
  export type EncounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to update a Encounter.
     */
    data: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
    /**
     * Choose, which Encounter to update.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter updateMany
   */
  export type EncounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to update.
     */
    limit?: number
  }

  /**
   * Encounter upsert
   */
  export type EncounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The filter to search for the Encounter to update in case it exists.
     */
    where: EncounterWhereUniqueInput
    /**
     * In case the Encounter found by the `where` argument doesn't exist, create a new Encounter with this data.
     */
    create: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
    /**
     * In case the Encounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
  }

  /**
   * Encounter delete
   */
  export type EncounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter which Encounter to delete.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter deleteMany
   */
  export type EncounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounters to delete
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to delete.
     */
    limit?: number
  }

  /**
   * Encounter.case
   */
  export type Encounter$caseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
  }

  /**
   * Encounter.diagnoses
   */
  export type Encounter$diagnosesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    where?: DiagnosisWhereInput
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    cursor?: DiagnosisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Encounter.procedures
   */
  export type Encounter$proceduresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    where?: ProcedureWhereInput
    orderBy?: ProcedureOrderByWithRelationInput | ProcedureOrderByWithRelationInput[]
    cursor?: ProcedureWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProcedureScalarFieldEnum | ProcedureScalarFieldEnum[]
  }

  /**
   * Encounter.preBillAnalyses
   */
  export type Encounter$preBillAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    where?: PreBillAnalysisWhereInput
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    cursor?: PreBillAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PreBillAnalysisScalarFieldEnum | PreBillAnalysisScalarFieldEnum[]
  }

  /**
   * Encounter without action
   */
  export type EncounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
  }


  /**
   * Model Diagnosis
   */

  export type AggregateDiagnosis = {
    _count: DiagnosisCountAggregateOutputType | null
    _min: DiagnosisMinAggregateOutputType | null
    _max: DiagnosisMaxAggregateOutputType | null
  }

  export type DiagnosisMinAggregateOutputType = {
    id: string | null
    encounterId: string | null
    icdCode: string | null
    description: string | null
    isPrimary: boolean | null
  }

  export type DiagnosisMaxAggregateOutputType = {
    id: string | null
    encounterId: string | null
    icdCode: string | null
    description: string | null
    isPrimary: boolean | null
  }

  export type DiagnosisCountAggregateOutputType = {
    id: number
    encounterId: number
    icdCode: number
    description: number
    isPrimary: number
    _all: number
  }


  export type DiagnosisMinAggregateInputType = {
    id?: true
    encounterId?: true
    icdCode?: true
    description?: true
    isPrimary?: true
  }

  export type DiagnosisMaxAggregateInputType = {
    id?: true
    encounterId?: true
    icdCode?: true
    description?: true
    isPrimary?: true
  }

  export type DiagnosisCountAggregateInputType = {
    id?: true
    encounterId?: true
    icdCode?: true
    description?: true
    isPrimary?: true
    _all?: true
  }

  export type DiagnosisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Diagnosis to aggregate.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Diagnoses
    **/
    _count?: true | DiagnosisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiagnosisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiagnosisMaxAggregateInputType
  }

  export type GetDiagnosisAggregateType<T extends DiagnosisAggregateArgs> = {
        [P in keyof T & keyof AggregateDiagnosis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiagnosis[P]>
      : GetScalarType<T[P], AggregateDiagnosis[P]>
  }




  export type DiagnosisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosisWhereInput
    orderBy?: DiagnosisOrderByWithAggregationInput | DiagnosisOrderByWithAggregationInput[]
    by: DiagnosisScalarFieldEnum[] | DiagnosisScalarFieldEnum
    having?: DiagnosisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiagnosisCountAggregateInputType | true
    _min?: DiagnosisMinAggregateInputType
    _max?: DiagnosisMaxAggregateInputType
  }

  export type DiagnosisGroupByOutputType = {
    id: string
    encounterId: string
    icdCode: string
    description: string
    isPrimary: boolean
    _count: DiagnosisCountAggregateOutputType | null
    _min: DiagnosisMinAggregateOutputType | null
    _max: DiagnosisMaxAggregateOutputType | null
  }

  type GetDiagnosisGroupByPayload<T extends DiagnosisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiagnosisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiagnosisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiagnosisGroupByOutputType[P]>
            : GetScalarType<T[P], DiagnosisGroupByOutputType[P]>
        }
      >
    >


  export type DiagnosisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    encounterId?: boolean
    icdCode?: boolean
    description?: boolean
    isPrimary?: boolean
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["diagnosis"]>



  export type DiagnosisSelectScalar = {
    id?: boolean
    encounterId?: boolean
    icdCode?: boolean
    description?: boolean
    isPrimary?: boolean
  }

  export type DiagnosisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "encounterId" | "icdCode" | "description" | "isPrimary", ExtArgs["result"]["diagnosis"]>
  export type DiagnosisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
  }

  export type $DiagnosisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Diagnosis"
    objects: {
      encounter: Prisma.$EncounterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      encounterId: string
      icdCode: string
      description: string
      isPrimary: boolean
    }, ExtArgs["result"]["diagnosis"]>
    composites: {}
  }

  type DiagnosisGetPayload<S extends boolean | null | undefined | DiagnosisDefaultArgs> = $Result.GetResult<Prisma.$DiagnosisPayload, S>

  type DiagnosisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiagnosisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiagnosisCountAggregateInputType | true
    }

  export interface DiagnosisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Diagnosis'], meta: { name: 'Diagnosis' } }
    /**
     * Find zero or one Diagnosis that matches the filter.
     * @param {DiagnosisFindUniqueArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiagnosisFindUniqueArgs>(args: SelectSubset<T, DiagnosisFindUniqueArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Diagnosis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiagnosisFindUniqueOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiagnosisFindUniqueOrThrowArgs>(args: SelectSubset<T, DiagnosisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Diagnosis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindFirstArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiagnosisFindFirstArgs>(args?: SelectSubset<T, DiagnosisFindFirstArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Diagnosis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindFirstOrThrowArgs} args - Arguments to find a Diagnosis
     * @example
     * // Get one Diagnosis
     * const diagnosis = await prisma.diagnosis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiagnosisFindFirstOrThrowArgs>(args?: SelectSubset<T, DiagnosisFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Diagnoses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Diagnoses
     * const diagnoses = await prisma.diagnosis.findMany()
     * 
     * // Get first 10 Diagnoses
     * const diagnoses = await prisma.diagnosis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diagnosisWithIdOnly = await prisma.diagnosis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiagnosisFindManyArgs>(args?: SelectSubset<T, DiagnosisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Diagnosis.
     * @param {DiagnosisCreateArgs} args - Arguments to create a Diagnosis.
     * @example
     * // Create one Diagnosis
     * const Diagnosis = await prisma.diagnosis.create({
     *   data: {
     *     // ... data to create a Diagnosis
     *   }
     * })
     * 
     */
    create<T extends DiagnosisCreateArgs>(args: SelectSubset<T, DiagnosisCreateArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Diagnoses.
     * @param {DiagnosisCreateManyArgs} args - Arguments to create many Diagnoses.
     * @example
     * // Create many Diagnoses
     * const diagnosis = await prisma.diagnosis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiagnosisCreateManyArgs>(args?: SelectSubset<T, DiagnosisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Diagnosis.
     * @param {DiagnosisDeleteArgs} args - Arguments to delete one Diagnosis.
     * @example
     * // Delete one Diagnosis
     * const Diagnosis = await prisma.diagnosis.delete({
     *   where: {
     *     // ... filter to delete one Diagnosis
     *   }
     * })
     * 
     */
    delete<T extends DiagnosisDeleteArgs>(args: SelectSubset<T, DiagnosisDeleteArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Diagnosis.
     * @param {DiagnosisUpdateArgs} args - Arguments to update one Diagnosis.
     * @example
     * // Update one Diagnosis
     * const diagnosis = await prisma.diagnosis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiagnosisUpdateArgs>(args: SelectSubset<T, DiagnosisUpdateArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Diagnoses.
     * @param {DiagnosisDeleteManyArgs} args - Arguments to filter Diagnoses to delete.
     * @example
     * // Delete a few Diagnoses
     * const { count } = await prisma.diagnosis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiagnosisDeleteManyArgs>(args?: SelectSubset<T, DiagnosisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Diagnoses
     * const diagnosis = await prisma.diagnosis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiagnosisUpdateManyArgs>(args: SelectSubset<T, DiagnosisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Diagnosis.
     * @param {DiagnosisUpsertArgs} args - Arguments to update or create a Diagnosis.
     * @example
     * // Update or create a Diagnosis
     * const diagnosis = await prisma.diagnosis.upsert({
     *   create: {
     *     // ... data to create a Diagnosis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Diagnosis we want to update
     *   }
     * })
     */
    upsert<T extends DiagnosisUpsertArgs>(args: SelectSubset<T, DiagnosisUpsertArgs<ExtArgs>>): Prisma__DiagnosisClient<$Result.GetResult<Prisma.$DiagnosisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Diagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisCountArgs} args - Arguments to filter Diagnoses to count.
     * @example
     * // Count the number of Diagnoses
     * const count = await prisma.diagnosis.count({
     *   where: {
     *     // ... the filter for the Diagnoses we want to count
     *   }
     * })
    **/
    count<T extends DiagnosisCountArgs>(
      args?: Subset<T, DiagnosisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiagnosisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Diagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiagnosisAggregateArgs>(args: Subset<T, DiagnosisAggregateArgs>): Prisma.PrismaPromise<GetDiagnosisAggregateType<T>>

    /**
     * Group by Diagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiagnosisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiagnosisGroupByArgs['orderBy'] }
        : { orderBy?: DiagnosisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiagnosisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Diagnosis model
   */
  readonly fields: DiagnosisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Diagnosis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiagnosisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    encounter<T extends EncounterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EncounterDefaultArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Diagnosis model
   */
  interface DiagnosisFieldRefs {
    readonly id: FieldRef<"Diagnosis", 'String'>
    readonly encounterId: FieldRef<"Diagnosis", 'String'>
    readonly icdCode: FieldRef<"Diagnosis", 'String'>
    readonly description: FieldRef<"Diagnosis", 'String'>
    readonly isPrimary: FieldRef<"Diagnosis", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Diagnosis findUnique
   */
  export type DiagnosisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis findUniqueOrThrow
   */
  export type DiagnosisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis findFirst
   */
  export type DiagnosisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis findFirstOrThrow
   */
  export type DiagnosisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnosis to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Diagnoses.
     */
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis findMany
   */
  export type DiagnosisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which Diagnoses to fetch.
     */
    where?: DiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Diagnoses to fetch.
     */
    orderBy?: DiagnosisOrderByWithRelationInput | DiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Diagnoses.
     */
    cursor?: DiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Diagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Diagnoses.
     */
    skip?: number
    distinct?: DiagnosisScalarFieldEnum | DiagnosisScalarFieldEnum[]
  }

  /**
   * Diagnosis create
   */
  export type DiagnosisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to create a Diagnosis.
     */
    data: XOR<DiagnosisCreateInput, DiagnosisUncheckedCreateInput>
  }

  /**
   * Diagnosis createMany
   */
  export type DiagnosisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Diagnoses.
     */
    data: DiagnosisCreateManyInput | DiagnosisCreateManyInput[]
  }

  /**
   * Diagnosis update
   */
  export type DiagnosisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to update a Diagnosis.
     */
    data: XOR<DiagnosisUpdateInput, DiagnosisUncheckedUpdateInput>
    /**
     * Choose, which Diagnosis to update.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis updateMany
   */
  export type DiagnosisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Diagnoses.
     */
    data: XOR<DiagnosisUpdateManyMutationInput, DiagnosisUncheckedUpdateManyInput>
    /**
     * Filter which Diagnoses to update
     */
    where?: DiagnosisWhereInput
    /**
     * Limit how many Diagnoses to update.
     */
    limit?: number
  }

  /**
   * Diagnosis upsert
   */
  export type DiagnosisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * The filter to search for the Diagnosis to update in case it exists.
     */
    where: DiagnosisWhereUniqueInput
    /**
     * In case the Diagnosis found by the `where` argument doesn't exist, create a new Diagnosis with this data.
     */
    create: XOR<DiagnosisCreateInput, DiagnosisUncheckedCreateInput>
    /**
     * In case the Diagnosis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiagnosisUpdateInput, DiagnosisUncheckedUpdateInput>
  }

  /**
   * Diagnosis delete
   */
  export type DiagnosisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
    /**
     * Filter which Diagnosis to delete.
     */
    where: DiagnosisWhereUniqueInput
  }

  /**
   * Diagnosis deleteMany
   */
  export type DiagnosisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Diagnoses to delete
     */
    where?: DiagnosisWhereInput
    /**
     * Limit how many Diagnoses to delete.
     */
    limit?: number
  }

  /**
   * Diagnosis without action
   */
  export type DiagnosisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Diagnosis
     */
    select?: DiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Diagnosis
     */
    omit?: DiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DiagnosisInclude<ExtArgs> | null
  }


  /**
   * Model Procedure
   */

  export type AggregateProcedure = {
    _count: ProcedureCountAggregateOutputType | null
    _min: ProcedureMinAggregateOutputType | null
    _max: ProcedureMaxAggregateOutputType | null
  }

  export type ProcedureMinAggregateOutputType = {
    id: string | null
    encounterId: string | null
    cptCode: string | null
    description: string | null
  }

  export type ProcedureMaxAggregateOutputType = {
    id: string | null
    encounterId: string | null
    cptCode: string | null
    description: string | null
  }

  export type ProcedureCountAggregateOutputType = {
    id: number
    encounterId: number
    cptCode: number
    description: number
    _all: number
  }


  export type ProcedureMinAggregateInputType = {
    id?: true
    encounterId?: true
    cptCode?: true
    description?: true
  }

  export type ProcedureMaxAggregateInputType = {
    id?: true
    encounterId?: true
    cptCode?: true
    description?: true
  }

  export type ProcedureCountAggregateInputType = {
    id?: true
    encounterId?: true
    cptCode?: true
    description?: true
    _all?: true
  }

  export type ProcedureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Procedure to aggregate.
     */
    where?: ProcedureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Procedures to fetch.
     */
    orderBy?: ProcedureOrderByWithRelationInput | ProcedureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcedureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Procedures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Procedures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Procedures
    **/
    _count?: true | ProcedureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcedureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcedureMaxAggregateInputType
  }

  export type GetProcedureAggregateType<T extends ProcedureAggregateArgs> = {
        [P in keyof T & keyof AggregateProcedure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcedure[P]>
      : GetScalarType<T[P], AggregateProcedure[P]>
  }




  export type ProcedureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcedureWhereInput
    orderBy?: ProcedureOrderByWithAggregationInput | ProcedureOrderByWithAggregationInput[]
    by: ProcedureScalarFieldEnum[] | ProcedureScalarFieldEnum
    having?: ProcedureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcedureCountAggregateInputType | true
    _min?: ProcedureMinAggregateInputType
    _max?: ProcedureMaxAggregateInputType
  }

  export type ProcedureGroupByOutputType = {
    id: string
    encounterId: string
    cptCode: string
    description: string
    _count: ProcedureCountAggregateOutputType | null
    _min: ProcedureMinAggregateOutputType | null
    _max: ProcedureMaxAggregateOutputType | null
  }

  type GetProcedureGroupByPayload<T extends ProcedureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcedureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcedureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcedureGroupByOutputType[P]>
            : GetScalarType<T[P], ProcedureGroupByOutputType[P]>
        }
      >
    >


  export type ProcedureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    encounterId?: boolean
    cptCode?: boolean
    description?: boolean
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["procedure"]>



  export type ProcedureSelectScalar = {
    id?: boolean
    encounterId?: boolean
    cptCode?: boolean
    description?: boolean
  }

  export type ProcedureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "encounterId" | "cptCode" | "description", ExtArgs["result"]["procedure"]>
  export type ProcedureInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
  }

  export type $ProcedurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Procedure"
    objects: {
      encounter: Prisma.$EncounterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      encounterId: string
      cptCode: string
      description: string
    }, ExtArgs["result"]["procedure"]>
    composites: {}
  }

  type ProcedureGetPayload<S extends boolean | null | undefined | ProcedureDefaultArgs> = $Result.GetResult<Prisma.$ProcedurePayload, S>

  type ProcedureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProcedureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProcedureCountAggregateInputType | true
    }

  export interface ProcedureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Procedure'], meta: { name: 'Procedure' } }
    /**
     * Find zero or one Procedure that matches the filter.
     * @param {ProcedureFindUniqueArgs} args - Arguments to find a Procedure
     * @example
     * // Get one Procedure
     * const procedure = await prisma.procedure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcedureFindUniqueArgs>(args: SelectSubset<T, ProcedureFindUniqueArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Procedure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcedureFindUniqueOrThrowArgs} args - Arguments to find a Procedure
     * @example
     * // Get one Procedure
     * const procedure = await prisma.procedure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcedureFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcedureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Procedure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureFindFirstArgs} args - Arguments to find a Procedure
     * @example
     * // Get one Procedure
     * const procedure = await prisma.procedure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcedureFindFirstArgs>(args?: SelectSubset<T, ProcedureFindFirstArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Procedure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureFindFirstOrThrowArgs} args - Arguments to find a Procedure
     * @example
     * // Get one Procedure
     * const procedure = await prisma.procedure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcedureFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcedureFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Procedures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Procedures
     * const procedures = await prisma.procedure.findMany()
     * 
     * // Get first 10 Procedures
     * const procedures = await prisma.procedure.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const procedureWithIdOnly = await prisma.procedure.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcedureFindManyArgs>(args?: SelectSubset<T, ProcedureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Procedure.
     * @param {ProcedureCreateArgs} args - Arguments to create a Procedure.
     * @example
     * // Create one Procedure
     * const Procedure = await prisma.procedure.create({
     *   data: {
     *     // ... data to create a Procedure
     *   }
     * })
     * 
     */
    create<T extends ProcedureCreateArgs>(args: SelectSubset<T, ProcedureCreateArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Procedures.
     * @param {ProcedureCreateManyArgs} args - Arguments to create many Procedures.
     * @example
     * // Create many Procedures
     * const procedure = await prisma.procedure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcedureCreateManyArgs>(args?: SelectSubset<T, ProcedureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Procedure.
     * @param {ProcedureDeleteArgs} args - Arguments to delete one Procedure.
     * @example
     * // Delete one Procedure
     * const Procedure = await prisma.procedure.delete({
     *   where: {
     *     // ... filter to delete one Procedure
     *   }
     * })
     * 
     */
    delete<T extends ProcedureDeleteArgs>(args: SelectSubset<T, ProcedureDeleteArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Procedure.
     * @param {ProcedureUpdateArgs} args - Arguments to update one Procedure.
     * @example
     * // Update one Procedure
     * const procedure = await prisma.procedure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcedureUpdateArgs>(args: SelectSubset<T, ProcedureUpdateArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Procedures.
     * @param {ProcedureDeleteManyArgs} args - Arguments to filter Procedures to delete.
     * @example
     * // Delete a few Procedures
     * const { count } = await prisma.procedure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcedureDeleteManyArgs>(args?: SelectSubset<T, ProcedureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Procedures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Procedures
     * const procedure = await prisma.procedure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcedureUpdateManyArgs>(args: SelectSubset<T, ProcedureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Procedure.
     * @param {ProcedureUpsertArgs} args - Arguments to update or create a Procedure.
     * @example
     * // Update or create a Procedure
     * const procedure = await prisma.procedure.upsert({
     *   create: {
     *     // ... data to create a Procedure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Procedure we want to update
     *   }
     * })
     */
    upsert<T extends ProcedureUpsertArgs>(args: SelectSubset<T, ProcedureUpsertArgs<ExtArgs>>): Prisma__ProcedureClient<$Result.GetResult<Prisma.$ProcedurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Procedures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureCountArgs} args - Arguments to filter Procedures to count.
     * @example
     * // Count the number of Procedures
     * const count = await prisma.procedure.count({
     *   where: {
     *     // ... the filter for the Procedures we want to count
     *   }
     * })
    **/
    count<T extends ProcedureCountArgs>(
      args?: Subset<T, ProcedureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcedureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Procedure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcedureAggregateArgs>(args: Subset<T, ProcedureAggregateArgs>): Prisma.PrismaPromise<GetProcedureAggregateType<T>>

    /**
     * Group by Procedure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcedureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcedureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcedureGroupByArgs['orderBy'] }
        : { orderBy?: ProcedureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcedureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcedureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Procedure model
   */
  readonly fields: ProcedureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Procedure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcedureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    encounter<T extends EncounterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EncounterDefaultArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Procedure model
   */
  interface ProcedureFieldRefs {
    readonly id: FieldRef<"Procedure", 'String'>
    readonly encounterId: FieldRef<"Procedure", 'String'>
    readonly cptCode: FieldRef<"Procedure", 'String'>
    readonly description: FieldRef<"Procedure", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Procedure findUnique
   */
  export type ProcedureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter, which Procedure to fetch.
     */
    where: ProcedureWhereUniqueInput
  }

  /**
   * Procedure findUniqueOrThrow
   */
  export type ProcedureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter, which Procedure to fetch.
     */
    where: ProcedureWhereUniqueInput
  }

  /**
   * Procedure findFirst
   */
  export type ProcedureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter, which Procedure to fetch.
     */
    where?: ProcedureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Procedures to fetch.
     */
    orderBy?: ProcedureOrderByWithRelationInput | ProcedureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Procedures.
     */
    cursor?: ProcedureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Procedures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Procedures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Procedures.
     */
    distinct?: ProcedureScalarFieldEnum | ProcedureScalarFieldEnum[]
  }

  /**
   * Procedure findFirstOrThrow
   */
  export type ProcedureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter, which Procedure to fetch.
     */
    where?: ProcedureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Procedures to fetch.
     */
    orderBy?: ProcedureOrderByWithRelationInput | ProcedureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Procedures.
     */
    cursor?: ProcedureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Procedures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Procedures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Procedures.
     */
    distinct?: ProcedureScalarFieldEnum | ProcedureScalarFieldEnum[]
  }

  /**
   * Procedure findMany
   */
  export type ProcedureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter, which Procedures to fetch.
     */
    where?: ProcedureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Procedures to fetch.
     */
    orderBy?: ProcedureOrderByWithRelationInput | ProcedureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Procedures.
     */
    cursor?: ProcedureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Procedures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Procedures.
     */
    skip?: number
    distinct?: ProcedureScalarFieldEnum | ProcedureScalarFieldEnum[]
  }

  /**
   * Procedure create
   */
  export type ProcedureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * The data needed to create a Procedure.
     */
    data: XOR<ProcedureCreateInput, ProcedureUncheckedCreateInput>
  }

  /**
   * Procedure createMany
   */
  export type ProcedureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Procedures.
     */
    data: ProcedureCreateManyInput | ProcedureCreateManyInput[]
  }

  /**
   * Procedure update
   */
  export type ProcedureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * The data needed to update a Procedure.
     */
    data: XOR<ProcedureUpdateInput, ProcedureUncheckedUpdateInput>
    /**
     * Choose, which Procedure to update.
     */
    where: ProcedureWhereUniqueInput
  }

  /**
   * Procedure updateMany
   */
  export type ProcedureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Procedures.
     */
    data: XOR<ProcedureUpdateManyMutationInput, ProcedureUncheckedUpdateManyInput>
    /**
     * Filter which Procedures to update
     */
    where?: ProcedureWhereInput
    /**
     * Limit how many Procedures to update.
     */
    limit?: number
  }

  /**
   * Procedure upsert
   */
  export type ProcedureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * The filter to search for the Procedure to update in case it exists.
     */
    where: ProcedureWhereUniqueInput
    /**
     * In case the Procedure found by the `where` argument doesn't exist, create a new Procedure with this data.
     */
    create: XOR<ProcedureCreateInput, ProcedureUncheckedCreateInput>
    /**
     * In case the Procedure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcedureUpdateInput, ProcedureUncheckedUpdateInput>
  }

  /**
   * Procedure delete
   */
  export type ProcedureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
    /**
     * Filter which Procedure to delete.
     */
    where: ProcedureWhereUniqueInput
  }

  /**
   * Procedure deleteMany
   */
  export type ProcedureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Procedures to delete
     */
    where?: ProcedureWhereInput
    /**
     * Limit how many Procedures to delete.
     */
    limit?: number
  }

  /**
   * Procedure without action
   */
  export type ProcedureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Procedure
     */
    select?: ProcedureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Procedure
     */
    omit?: ProcedureOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcedureInclude<ExtArgs> | null
  }


  /**
   * Model PreBillAnalysis
   */

  export type AggregatePreBillAnalysis = {
    _count: PreBillAnalysisCountAggregateOutputType | null
    _avg: PreBillAnalysisAvgAggregateOutputType | null
    _sum: PreBillAnalysisSumAggregateOutputType | null
    _min: PreBillAnalysisMinAggregateOutputType | null
    _max: PreBillAnalysisMaxAggregateOutputType | null
  }

  export type PreBillAnalysisAvgAggregateOutputType = {
    confidence: number | null
    potentialFinancialImpact: number | null
  }

  export type PreBillAnalysisSumAggregateOutputType = {
    confidence: number | null
    potentialFinancialImpact: number | null
  }

  export type PreBillAnalysisMinAggregateOutputType = {
    id: string | null
    encounterId: string | null
    confidence: number | null
    recommendations: string | null
    riskFactors: string | null
    notes: string | null
    status: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    potentialFinancialImpact: number | null
    description: string | null
    evidenceId: string | null
    embedding: string | null
  }

  export type PreBillAnalysisMaxAggregateOutputType = {
    id: string | null
    encounterId: string | null
    confidence: number | null
    recommendations: string | null
    riskFactors: string | null
    notes: string | null
    status: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    potentialFinancialImpact: number | null
    description: string | null
    evidenceId: string | null
    embedding: string | null
  }

  export type PreBillAnalysisCountAggregateOutputType = {
    id: number
    encounterId: number
    confidence: number
    recommendations: number
    riskFactors: number
    notes: number
    status: number
    userId: number
    createdAt: number
    updatedAt: number
    potentialFinancialImpact: number
    description: number
    evidenceId: number
    embedding: number
    _all: number
  }


  export type PreBillAnalysisAvgAggregateInputType = {
    confidence?: true
    potentialFinancialImpact?: true
  }

  export type PreBillAnalysisSumAggregateInputType = {
    confidence?: true
    potentialFinancialImpact?: true
  }

  export type PreBillAnalysisMinAggregateInputType = {
    id?: true
    encounterId?: true
    confidence?: true
    recommendations?: true
    riskFactors?: true
    notes?: true
    status?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    potentialFinancialImpact?: true
    description?: true
    evidenceId?: true
    embedding?: true
  }

  export type PreBillAnalysisMaxAggregateInputType = {
    id?: true
    encounterId?: true
    confidence?: true
    recommendations?: true
    riskFactors?: true
    notes?: true
    status?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    potentialFinancialImpact?: true
    description?: true
    evidenceId?: true
    embedding?: true
  }

  export type PreBillAnalysisCountAggregateInputType = {
    id?: true
    encounterId?: true
    confidence?: true
    recommendations?: true
    riskFactors?: true
    notes?: true
    status?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    potentialFinancialImpact?: true
    description?: true
    evidenceId?: true
    embedding?: true
    _all?: true
  }

  export type PreBillAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreBillAnalysis to aggregate.
     */
    where?: PreBillAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreBillAnalyses to fetch.
     */
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PreBillAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreBillAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreBillAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PreBillAnalyses
    **/
    _count?: true | PreBillAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PreBillAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PreBillAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PreBillAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PreBillAnalysisMaxAggregateInputType
  }

  export type GetPreBillAnalysisAggregateType<T extends PreBillAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregatePreBillAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePreBillAnalysis[P]>
      : GetScalarType<T[P], AggregatePreBillAnalysis[P]>
  }




  export type PreBillAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PreBillAnalysisWhereInput
    orderBy?: PreBillAnalysisOrderByWithAggregationInput | PreBillAnalysisOrderByWithAggregationInput[]
    by: PreBillAnalysisScalarFieldEnum[] | PreBillAnalysisScalarFieldEnum
    having?: PreBillAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PreBillAnalysisCountAggregateInputType | true
    _avg?: PreBillAnalysisAvgAggregateInputType
    _sum?: PreBillAnalysisSumAggregateInputType
    _min?: PreBillAnalysisMinAggregateInputType
    _max?: PreBillAnalysisMaxAggregateInputType
  }

  export type PreBillAnalysisGroupByOutputType = {
    id: string
    encounterId: string
    confidence: number
    recommendations: string
    riskFactors: string | null
    notes: string | null
    status: string
    userId: string | null
    createdAt: Date
    updatedAt: Date
    potentialFinancialImpact: number | null
    description: string | null
    evidenceId: string | null
    embedding: string | null
    _count: PreBillAnalysisCountAggregateOutputType | null
    _avg: PreBillAnalysisAvgAggregateOutputType | null
    _sum: PreBillAnalysisSumAggregateOutputType | null
    _min: PreBillAnalysisMinAggregateOutputType | null
    _max: PreBillAnalysisMaxAggregateOutputType | null
  }

  type GetPreBillAnalysisGroupByPayload<T extends PreBillAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PreBillAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PreBillAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PreBillAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], PreBillAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type PreBillAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    encounterId?: boolean
    confidence?: boolean
    recommendations?: boolean
    riskFactors?: boolean
    notes?: boolean
    status?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    potentialFinancialImpact?: boolean
    description?: boolean
    evidenceId?: boolean
    embedding?: boolean
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
    user?: boolean | PreBillAnalysis$userArgs<ExtArgs>
  }, ExtArgs["result"]["preBillAnalysis"]>



  export type PreBillAnalysisSelectScalar = {
    id?: boolean
    encounterId?: boolean
    confidence?: boolean
    recommendations?: boolean
    riskFactors?: boolean
    notes?: boolean
    status?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    potentialFinancialImpact?: boolean
    description?: boolean
    evidenceId?: boolean
    embedding?: boolean
  }

  export type PreBillAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "encounterId" | "confidence" | "recommendations" | "riskFactors" | "notes" | "status" | "userId" | "createdAt" | "updatedAt" | "potentialFinancialImpact" | "description" | "evidenceId" | "embedding", ExtArgs["result"]["preBillAnalysis"]>
  export type PreBillAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounter?: boolean | EncounterDefaultArgs<ExtArgs>
    user?: boolean | PreBillAnalysis$userArgs<ExtArgs>
  }

  export type $PreBillAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PreBillAnalysis"
    objects: {
      encounter: Prisma.$EncounterPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      encounterId: string
      confidence: number
      recommendations: string
      riskFactors: string | null
      notes: string | null
      status: string
      userId: string | null
      createdAt: Date
      updatedAt: Date
      potentialFinancialImpact: number | null
      description: string | null
      evidenceId: string | null
      embedding: string | null
    }, ExtArgs["result"]["preBillAnalysis"]>
    composites: {}
  }

  type PreBillAnalysisGetPayload<S extends boolean | null | undefined | PreBillAnalysisDefaultArgs> = $Result.GetResult<Prisma.$PreBillAnalysisPayload, S>

  type PreBillAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PreBillAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PreBillAnalysisCountAggregateInputType | true
    }

  export interface PreBillAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PreBillAnalysis'], meta: { name: 'PreBillAnalysis' } }
    /**
     * Find zero or one PreBillAnalysis that matches the filter.
     * @param {PreBillAnalysisFindUniqueArgs} args - Arguments to find a PreBillAnalysis
     * @example
     * // Get one PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PreBillAnalysisFindUniqueArgs>(args: SelectSubset<T, PreBillAnalysisFindUniqueArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PreBillAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PreBillAnalysisFindUniqueOrThrowArgs} args - Arguments to find a PreBillAnalysis
     * @example
     * // Get one PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PreBillAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, PreBillAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreBillAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisFindFirstArgs} args - Arguments to find a PreBillAnalysis
     * @example
     * // Get one PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PreBillAnalysisFindFirstArgs>(args?: SelectSubset<T, PreBillAnalysisFindFirstArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PreBillAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisFindFirstOrThrowArgs} args - Arguments to find a PreBillAnalysis
     * @example
     * // Get one PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PreBillAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, PreBillAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PreBillAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PreBillAnalyses
     * const preBillAnalyses = await prisma.preBillAnalysis.findMany()
     * 
     * // Get first 10 PreBillAnalyses
     * const preBillAnalyses = await prisma.preBillAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const preBillAnalysisWithIdOnly = await prisma.preBillAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PreBillAnalysisFindManyArgs>(args?: SelectSubset<T, PreBillAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PreBillAnalysis.
     * @param {PreBillAnalysisCreateArgs} args - Arguments to create a PreBillAnalysis.
     * @example
     * // Create one PreBillAnalysis
     * const PreBillAnalysis = await prisma.preBillAnalysis.create({
     *   data: {
     *     // ... data to create a PreBillAnalysis
     *   }
     * })
     * 
     */
    create<T extends PreBillAnalysisCreateArgs>(args: SelectSubset<T, PreBillAnalysisCreateArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PreBillAnalyses.
     * @param {PreBillAnalysisCreateManyArgs} args - Arguments to create many PreBillAnalyses.
     * @example
     * // Create many PreBillAnalyses
     * const preBillAnalysis = await prisma.preBillAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PreBillAnalysisCreateManyArgs>(args?: SelectSubset<T, PreBillAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PreBillAnalysis.
     * @param {PreBillAnalysisDeleteArgs} args - Arguments to delete one PreBillAnalysis.
     * @example
     * // Delete one PreBillAnalysis
     * const PreBillAnalysis = await prisma.preBillAnalysis.delete({
     *   where: {
     *     // ... filter to delete one PreBillAnalysis
     *   }
     * })
     * 
     */
    delete<T extends PreBillAnalysisDeleteArgs>(args: SelectSubset<T, PreBillAnalysisDeleteArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PreBillAnalysis.
     * @param {PreBillAnalysisUpdateArgs} args - Arguments to update one PreBillAnalysis.
     * @example
     * // Update one PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PreBillAnalysisUpdateArgs>(args: SelectSubset<T, PreBillAnalysisUpdateArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PreBillAnalyses.
     * @param {PreBillAnalysisDeleteManyArgs} args - Arguments to filter PreBillAnalyses to delete.
     * @example
     * // Delete a few PreBillAnalyses
     * const { count } = await prisma.preBillAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PreBillAnalysisDeleteManyArgs>(args?: SelectSubset<T, PreBillAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PreBillAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PreBillAnalyses
     * const preBillAnalysis = await prisma.preBillAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PreBillAnalysisUpdateManyArgs>(args: SelectSubset<T, PreBillAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PreBillAnalysis.
     * @param {PreBillAnalysisUpsertArgs} args - Arguments to update or create a PreBillAnalysis.
     * @example
     * // Update or create a PreBillAnalysis
     * const preBillAnalysis = await prisma.preBillAnalysis.upsert({
     *   create: {
     *     // ... data to create a PreBillAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PreBillAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends PreBillAnalysisUpsertArgs>(args: SelectSubset<T, PreBillAnalysisUpsertArgs<ExtArgs>>): Prisma__PreBillAnalysisClient<$Result.GetResult<Prisma.$PreBillAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PreBillAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisCountArgs} args - Arguments to filter PreBillAnalyses to count.
     * @example
     * // Count the number of PreBillAnalyses
     * const count = await prisma.preBillAnalysis.count({
     *   where: {
     *     // ... the filter for the PreBillAnalyses we want to count
     *   }
     * })
    **/
    count<T extends PreBillAnalysisCountArgs>(
      args?: Subset<T, PreBillAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PreBillAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PreBillAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PreBillAnalysisAggregateArgs>(args: Subset<T, PreBillAnalysisAggregateArgs>): Prisma.PrismaPromise<GetPreBillAnalysisAggregateType<T>>

    /**
     * Group by PreBillAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PreBillAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PreBillAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PreBillAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: PreBillAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PreBillAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPreBillAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PreBillAnalysis model
   */
  readonly fields: PreBillAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PreBillAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PreBillAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    encounter<T extends EncounterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EncounterDefaultArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends PreBillAnalysis$userArgs<ExtArgs> = {}>(args?: Subset<T, PreBillAnalysis$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PreBillAnalysis model
   */
  interface PreBillAnalysisFieldRefs {
    readonly id: FieldRef<"PreBillAnalysis", 'String'>
    readonly encounterId: FieldRef<"PreBillAnalysis", 'String'>
    readonly confidence: FieldRef<"PreBillAnalysis", 'Float'>
    readonly recommendations: FieldRef<"PreBillAnalysis", 'String'>
    readonly riskFactors: FieldRef<"PreBillAnalysis", 'String'>
    readonly notes: FieldRef<"PreBillAnalysis", 'String'>
    readonly status: FieldRef<"PreBillAnalysis", 'String'>
    readonly userId: FieldRef<"PreBillAnalysis", 'String'>
    readonly createdAt: FieldRef<"PreBillAnalysis", 'DateTime'>
    readonly updatedAt: FieldRef<"PreBillAnalysis", 'DateTime'>
    readonly potentialFinancialImpact: FieldRef<"PreBillAnalysis", 'Float'>
    readonly description: FieldRef<"PreBillAnalysis", 'String'>
    readonly evidenceId: FieldRef<"PreBillAnalysis", 'String'>
    readonly embedding: FieldRef<"PreBillAnalysis", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PreBillAnalysis findUnique
   */
  export type PreBillAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which PreBillAnalysis to fetch.
     */
    where: PreBillAnalysisWhereUniqueInput
  }

  /**
   * PreBillAnalysis findUniqueOrThrow
   */
  export type PreBillAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which PreBillAnalysis to fetch.
     */
    where: PreBillAnalysisWhereUniqueInput
  }

  /**
   * PreBillAnalysis findFirst
   */
  export type PreBillAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which PreBillAnalysis to fetch.
     */
    where?: PreBillAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreBillAnalyses to fetch.
     */
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreBillAnalyses.
     */
    cursor?: PreBillAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreBillAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreBillAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreBillAnalyses.
     */
    distinct?: PreBillAnalysisScalarFieldEnum | PreBillAnalysisScalarFieldEnum[]
  }

  /**
   * PreBillAnalysis findFirstOrThrow
   */
  export type PreBillAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which PreBillAnalysis to fetch.
     */
    where?: PreBillAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreBillAnalyses to fetch.
     */
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PreBillAnalyses.
     */
    cursor?: PreBillAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreBillAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreBillAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PreBillAnalyses.
     */
    distinct?: PreBillAnalysisScalarFieldEnum | PreBillAnalysisScalarFieldEnum[]
  }

  /**
   * PreBillAnalysis findMany
   */
  export type PreBillAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which PreBillAnalyses to fetch.
     */
    where?: PreBillAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PreBillAnalyses to fetch.
     */
    orderBy?: PreBillAnalysisOrderByWithRelationInput | PreBillAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PreBillAnalyses.
     */
    cursor?: PreBillAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PreBillAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PreBillAnalyses.
     */
    skip?: number
    distinct?: PreBillAnalysisScalarFieldEnum | PreBillAnalysisScalarFieldEnum[]
  }

  /**
   * PreBillAnalysis create
   */
  export type PreBillAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a PreBillAnalysis.
     */
    data: XOR<PreBillAnalysisCreateInput, PreBillAnalysisUncheckedCreateInput>
  }

  /**
   * PreBillAnalysis createMany
   */
  export type PreBillAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PreBillAnalyses.
     */
    data: PreBillAnalysisCreateManyInput | PreBillAnalysisCreateManyInput[]
  }

  /**
   * PreBillAnalysis update
   */
  export type PreBillAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a PreBillAnalysis.
     */
    data: XOR<PreBillAnalysisUpdateInput, PreBillAnalysisUncheckedUpdateInput>
    /**
     * Choose, which PreBillAnalysis to update.
     */
    where: PreBillAnalysisWhereUniqueInput
  }

  /**
   * PreBillAnalysis updateMany
   */
  export type PreBillAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PreBillAnalyses.
     */
    data: XOR<PreBillAnalysisUpdateManyMutationInput, PreBillAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which PreBillAnalyses to update
     */
    where?: PreBillAnalysisWhereInput
    /**
     * Limit how many PreBillAnalyses to update.
     */
    limit?: number
  }

  /**
   * PreBillAnalysis upsert
   */
  export type PreBillAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the PreBillAnalysis to update in case it exists.
     */
    where: PreBillAnalysisWhereUniqueInput
    /**
     * In case the PreBillAnalysis found by the `where` argument doesn't exist, create a new PreBillAnalysis with this data.
     */
    create: XOR<PreBillAnalysisCreateInput, PreBillAnalysisUncheckedCreateInput>
    /**
     * In case the PreBillAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PreBillAnalysisUpdateInput, PreBillAnalysisUncheckedUpdateInput>
  }

  /**
   * PreBillAnalysis delete
   */
  export type PreBillAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
    /**
     * Filter which PreBillAnalysis to delete.
     */
    where: PreBillAnalysisWhereUniqueInput
  }

  /**
   * PreBillAnalysis deleteMany
   */
  export type PreBillAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PreBillAnalyses to delete
     */
    where?: PreBillAnalysisWhereInput
    /**
     * Limit how many PreBillAnalyses to delete.
     */
    limit?: number
  }

  /**
   * PreBillAnalysis.user
   */
  export type PreBillAnalysis$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PreBillAnalysis without action
   */
  export type PreBillAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PreBillAnalysis
     */
    select?: PreBillAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PreBillAnalysis
     */
    omit?: PreBillAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PreBillAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Denial
   */

  export type AggregateDenial = {
    _count: DenialCountAggregateOutputType | null
    _avg: DenialAvgAggregateOutputType | null
    _sum: DenialSumAggregateOutputType | null
    _min: DenialMinAggregateOutputType | null
    _max: DenialMaxAggregateOutputType | null
  }

  export type DenialAvgAggregateOutputType = {
    amount: number | null
    deniedAmount: number | null
  }

  export type DenialSumAggregateOutputType = {
    amount: number | null
    deniedAmount: number | null
  }

  export type DenialMinAggregateOutputType = {
    id: string | null
    caseId: string | null
    denialReason: string | null
    amount: number | null
    status: string | null
    appealDate: Date | null
    resolution: string | null
    createdAt: Date | null
    updatedAt: Date | null
    denialReasonCode: string | null
    deniedAmount: number | null
    appealLetterDraft: string | null
    claimFhirId: string | null
  }

  export type DenialMaxAggregateOutputType = {
    id: string | null
    caseId: string | null
    denialReason: string | null
    amount: number | null
    status: string | null
    appealDate: Date | null
    resolution: string | null
    createdAt: Date | null
    updatedAt: Date | null
    denialReasonCode: string | null
    deniedAmount: number | null
    appealLetterDraft: string | null
    claimFhirId: string | null
  }

  export type DenialCountAggregateOutputType = {
    id: number
    caseId: number
    denialReason: number
    amount: number
    status: number
    appealDate: number
    resolution: number
    createdAt: number
    updatedAt: number
    denialReasonCode: number
    deniedAmount: number
    appealLetterDraft: number
    claimFhirId: number
    _all: number
  }


  export type DenialAvgAggregateInputType = {
    amount?: true
    deniedAmount?: true
  }

  export type DenialSumAggregateInputType = {
    amount?: true
    deniedAmount?: true
  }

  export type DenialMinAggregateInputType = {
    id?: true
    caseId?: true
    denialReason?: true
    amount?: true
    status?: true
    appealDate?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
    denialReasonCode?: true
    deniedAmount?: true
    appealLetterDraft?: true
    claimFhirId?: true
  }

  export type DenialMaxAggregateInputType = {
    id?: true
    caseId?: true
    denialReason?: true
    amount?: true
    status?: true
    appealDate?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
    denialReasonCode?: true
    deniedAmount?: true
    appealLetterDraft?: true
    claimFhirId?: true
  }

  export type DenialCountAggregateInputType = {
    id?: true
    caseId?: true
    denialReason?: true
    amount?: true
    status?: true
    appealDate?: true
    resolution?: true
    createdAt?: true
    updatedAt?: true
    denialReasonCode?: true
    deniedAmount?: true
    appealLetterDraft?: true
    claimFhirId?: true
    _all?: true
  }

  export type DenialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Denial to aggregate.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Denials
    **/
    _count?: true | DenialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DenialAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DenialSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DenialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DenialMaxAggregateInputType
  }

  export type GetDenialAggregateType<T extends DenialAggregateArgs> = {
        [P in keyof T & keyof AggregateDenial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDenial[P]>
      : GetScalarType<T[P], AggregateDenial[P]>
  }




  export type DenialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DenialWhereInput
    orderBy?: DenialOrderByWithAggregationInput | DenialOrderByWithAggregationInput[]
    by: DenialScalarFieldEnum[] | DenialScalarFieldEnum
    having?: DenialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DenialCountAggregateInputType | true
    _avg?: DenialAvgAggregateInputType
    _sum?: DenialSumAggregateInputType
    _min?: DenialMinAggregateInputType
    _max?: DenialMaxAggregateInputType
  }

  export type DenialGroupByOutputType = {
    id: string
    caseId: string | null
    denialReason: string
    amount: number
    status: string
    appealDate: Date | null
    resolution: string | null
    createdAt: Date
    updatedAt: Date
    denialReasonCode: string | null
    deniedAmount: number | null
    appealLetterDraft: string | null
    claimFhirId: string | null
    _count: DenialCountAggregateOutputType | null
    _avg: DenialAvgAggregateOutputType | null
    _sum: DenialSumAggregateOutputType | null
    _min: DenialMinAggregateOutputType | null
    _max: DenialMaxAggregateOutputType | null
  }

  type GetDenialGroupByPayload<T extends DenialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DenialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DenialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DenialGroupByOutputType[P]>
            : GetScalarType<T[P], DenialGroupByOutputType[P]>
        }
      >
    >


  export type DenialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    denialReason?: boolean
    amount?: boolean
    status?: boolean
    appealDate?: boolean
    resolution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    denialReasonCode?: boolean
    deniedAmount?: boolean
    appealLetterDraft?: boolean
    claimFhirId?: boolean
    case?: boolean | Denial$caseArgs<ExtArgs>
  }, ExtArgs["result"]["denial"]>



  export type DenialSelectScalar = {
    id?: boolean
    caseId?: boolean
    denialReason?: boolean
    amount?: boolean
    status?: boolean
    appealDate?: boolean
    resolution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    denialReasonCode?: boolean
    deniedAmount?: boolean
    appealLetterDraft?: boolean
    claimFhirId?: boolean
  }

  export type DenialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "denialReason" | "amount" | "status" | "appealDate" | "resolution" | "createdAt" | "updatedAt" | "denialReasonCode" | "deniedAmount" | "appealLetterDraft" | "claimFhirId", ExtArgs["result"]["denial"]>
  export type DenialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | Denial$caseArgs<ExtArgs>
  }

  export type $DenialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Denial"
    objects: {
      case: Prisma.$CasePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      caseId: string | null
      denialReason: string
      amount: number
      status: string
      appealDate: Date | null
      resolution: string | null
      createdAt: Date
      updatedAt: Date
      denialReasonCode: string | null
      deniedAmount: number | null
      appealLetterDraft: string | null
      claimFhirId: string | null
    }, ExtArgs["result"]["denial"]>
    composites: {}
  }

  type DenialGetPayload<S extends boolean | null | undefined | DenialDefaultArgs> = $Result.GetResult<Prisma.$DenialPayload, S>

  type DenialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DenialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DenialCountAggregateInputType | true
    }

  export interface DenialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Denial'], meta: { name: 'Denial' } }
    /**
     * Find zero or one Denial that matches the filter.
     * @param {DenialFindUniqueArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DenialFindUniqueArgs>(args: SelectSubset<T, DenialFindUniqueArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Denial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DenialFindUniqueOrThrowArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DenialFindUniqueOrThrowArgs>(args: SelectSubset<T, DenialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Denial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindFirstArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DenialFindFirstArgs>(args?: SelectSubset<T, DenialFindFirstArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Denial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindFirstOrThrowArgs} args - Arguments to find a Denial
     * @example
     * // Get one Denial
     * const denial = await prisma.denial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DenialFindFirstOrThrowArgs>(args?: SelectSubset<T, DenialFindFirstOrThrowArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Denials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Denials
     * const denials = await prisma.denial.findMany()
     * 
     * // Get first 10 Denials
     * const denials = await prisma.denial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const denialWithIdOnly = await prisma.denial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DenialFindManyArgs>(args?: SelectSubset<T, DenialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Denial.
     * @param {DenialCreateArgs} args - Arguments to create a Denial.
     * @example
     * // Create one Denial
     * const Denial = await prisma.denial.create({
     *   data: {
     *     // ... data to create a Denial
     *   }
     * })
     * 
     */
    create<T extends DenialCreateArgs>(args: SelectSubset<T, DenialCreateArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Denials.
     * @param {DenialCreateManyArgs} args - Arguments to create many Denials.
     * @example
     * // Create many Denials
     * const denial = await prisma.denial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DenialCreateManyArgs>(args?: SelectSubset<T, DenialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Denial.
     * @param {DenialDeleteArgs} args - Arguments to delete one Denial.
     * @example
     * // Delete one Denial
     * const Denial = await prisma.denial.delete({
     *   where: {
     *     // ... filter to delete one Denial
     *   }
     * })
     * 
     */
    delete<T extends DenialDeleteArgs>(args: SelectSubset<T, DenialDeleteArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Denial.
     * @param {DenialUpdateArgs} args - Arguments to update one Denial.
     * @example
     * // Update one Denial
     * const denial = await prisma.denial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DenialUpdateArgs>(args: SelectSubset<T, DenialUpdateArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Denials.
     * @param {DenialDeleteManyArgs} args - Arguments to filter Denials to delete.
     * @example
     * // Delete a few Denials
     * const { count } = await prisma.denial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DenialDeleteManyArgs>(args?: SelectSubset<T, DenialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Denials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Denials
     * const denial = await prisma.denial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DenialUpdateManyArgs>(args: SelectSubset<T, DenialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Denial.
     * @param {DenialUpsertArgs} args - Arguments to update or create a Denial.
     * @example
     * // Update or create a Denial
     * const denial = await prisma.denial.upsert({
     *   create: {
     *     // ... data to create a Denial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Denial we want to update
     *   }
     * })
     */
    upsert<T extends DenialUpsertArgs>(args: SelectSubset<T, DenialUpsertArgs<ExtArgs>>): Prisma__DenialClient<$Result.GetResult<Prisma.$DenialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Denials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialCountArgs} args - Arguments to filter Denials to count.
     * @example
     * // Count the number of Denials
     * const count = await prisma.denial.count({
     *   where: {
     *     // ... the filter for the Denials we want to count
     *   }
     * })
    **/
    count<T extends DenialCountArgs>(
      args?: Subset<T, DenialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DenialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Denial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DenialAggregateArgs>(args: Subset<T, DenialAggregateArgs>): Prisma.PrismaPromise<GetDenialAggregateType<T>>

    /**
     * Group by Denial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DenialGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DenialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DenialGroupByArgs['orderBy'] }
        : { orderBy?: DenialGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DenialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDenialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Denial model
   */
  readonly fields: DenialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Denial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DenialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends Denial$caseArgs<ExtArgs> = {}>(args?: Subset<T, Denial$caseArgs<ExtArgs>>): Prisma__CaseClient<$Result.GetResult<Prisma.$CasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Denial model
   */
  interface DenialFieldRefs {
    readonly id: FieldRef<"Denial", 'String'>
    readonly caseId: FieldRef<"Denial", 'String'>
    readonly denialReason: FieldRef<"Denial", 'String'>
    readonly amount: FieldRef<"Denial", 'Float'>
    readonly status: FieldRef<"Denial", 'String'>
    readonly appealDate: FieldRef<"Denial", 'DateTime'>
    readonly resolution: FieldRef<"Denial", 'String'>
    readonly createdAt: FieldRef<"Denial", 'DateTime'>
    readonly updatedAt: FieldRef<"Denial", 'DateTime'>
    readonly denialReasonCode: FieldRef<"Denial", 'String'>
    readonly deniedAmount: FieldRef<"Denial", 'Float'>
    readonly appealLetterDraft: FieldRef<"Denial", 'String'>
    readonly claimFhirId: FieldRef<"Denial", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Denial findUnique
   */
  export type DenialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial findUniqueOrThrow
   */
  export type DenialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial findFirst
   */
  export type DenialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Denials.
     */
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial findFirstOrThrow
   */
  export type DenialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denial to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Denials.
     */
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial findMany
   */
  export type DenialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter, which Denials to fetch.
     */
    where?: DenialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Denials to fetch.
     */
    orderBy?: DenialOrderByWithRelationInput | DenialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Denials.
     */
    cursor?: DenialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Denials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Denials.
     */
    skip?: number
    distinct?: DenialScalarFieldEnum | DenialScalarFieldEnum[]
  }

  /**
   * Denial create
   */
  export type DenialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The data needed to create a Denial.
     */
    data: XOR<DenialCreateInput, DenialUncheckedCreateInput>
  }

  /**
   * Denial createMany
   */
  export type DenialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Denials.
     */
    data: DenialCreateManyInput | DenialCreateManyInput[]
  }

  /**
   * Denial update
   */
  export type DenialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The data needed to update a Denial.
     */
    data: XOR<DenialUpdateInput, DenialUncheckedUpdateInput>
    /**
     * Choose, which Denial to update.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial updateMany
   */
  export type DenialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Denials.
     */
    data: XOR<DenialUpdateManyMutationInput, DenialUncheckedUpdateManyInput>
    /**
     * Filter which Denials to update
     */
    where?: DenialWhereInput
    /**
     * Limit how many Denials to update.
     */
    limit?: number
  }

  /**
   * Denial upsert
   */
  export type DenialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * The filter to search for the Denial to update in case it exists.
     */
    where: DenialWhereUniqueInput
    /**
     * In case the Denial found by the `where` argument doesn't exist, create a new Denial with this data.
     */
    create: XOR<DenialCreateInput, DenialUncheckedCreateInput>
    /**
     * In case the Denial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DenialUpdateInput, DenialUncheckedUpdateInput>
  }

  /**
   * Denial delete
   */
  export type DenialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
    /**
     * Filter which Denial to delete.
     */
    where: DenialWhereUniqueInput
  }

  /**
   * Denial deleteMany
   */
  export type DenialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Denials to delete
     */
    where?: DenialWhereInput
    /**
     * Limit how many Denials to delete.
     */
    limit?: number
  }

  /**
   * Denial.case
   */
  export type Denial$caseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Case
     */
    select?: CaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Case
     */
    omit?: CaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseInclude<ExtArgs> | null
    where?: CaseWhereInput
  }

  /**
   * Denial without action
   */
  export type DenialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Denial
     */
    select?: DenialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Denial
     */
    omit?: DenialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DenialInclude<ExtArgs> | null
  }


  /**
   * Model Analytics
   */

  export type AggregateAnalytics = {
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  export type AnalyticsAvgAggregateOutputType = {
    value: number | null
  }

  export type AnalyticsSumAggregateOutputType = {
    value: number | null
  }

  export type AnalyticsMinAggregateOutputType = {
    id: string | null
    metric: string | null
    value: number | null
    dimension: string | null
    timestamp: Date | null
    caseId: string | null
    userId: string | null
    activityType: string | null
    description: string | null
  }

  export type AnalyticsMaxAggregateOutputType = {
    id: string | null
    metric: string | null
    value: number | null
    dimension: string | null
    timestamp: Date | null
    caseId: string | null
    userId: string | null
    activityType: string | null
    description: string | null
  }

  export type AnalyticsCountAggregateOutputType = {
    id: number
    metric: number
    value: number
    dimension: number
    timestamp: number
    caseId: number
    userId: number
    activityType: number
    description: number
    _all: number
  }


  export type AnalyticsAvgAggregateInputType = {
    value?: true
  }

  export type AnalyticsSumAggregateInputType = {
    value?: true
  }

  export type AnalyticsMinAggregateInputType = {
    id?: true
    metric?: true
    value?: true
    dimension?: true
    timestamp?: true
    caseId?: true
    userId?: true
    activityType?: true
    description?: true
  }

  export type AnalyticsMaxAggregateInputType = {
    id?: true
    metric?: true
    value?: true
    dimension?: true
    timestamp?: true
    caseId?: true
    userId?: true
    activityType?: true
    description?: true
  }

  export type AnalyticsCountAggregateInputType = {
    id?: true
    metric?: true
    value?: true
    dimension?: true
    timestamp?: true
    caseId?: true
    userId?: true
    activityType?: true
    description?: true
    _all?: true
  }

  export type AnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to aggregate.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Analytics
    **/
    _count?: true | AnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsMaxAggregateInputType
  }

  export type GetAnalyticsAggregateType<T extends AnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalytics[P]>
      : GetScalarType<T[P], AggregateAnalytics[P]>
  }




  export type AnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsWhereInput
    orderBy?: AnalyticsOrderByWithAggregationInput | AnalyticsOrderByWithAggregationInput[]
    by: AnalyticsScalarFieldEnum[] | AnalyticsScalarFieldEnum
    having?: AnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsCountAggregateInputType | true
    _avg?: AnalyticsAvgAggregateInputType
    _sum?: AnalyticsSumAggregateInputType
    _min?: AnalyticsMinAggregateInputType
    _max?: AnalyticsMaxAggregateInputType
  }

  export type AnalyticsGroupByOutputType = {
    id: string
    metric: string
    value: number
    dimension: string | null
    timestamp: Date
    caseId: string | null
    userId: string | null
    activityType: string | null
    description: string | null
    _count: AnalyticsCountAggregateOutputType | null
    _avg: AnalyticsAvgAggregateOutputType | null
    _sum: AnalyticsSumAggregateOutputType | null
    _min: AnalyticsMinAggregateOutputType | null
    _max: AnalyticsMaxAggregateOutputType | null
  }

  type GetAnalyticsGroupByPayload<T extends AnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    metric?: boolean
    value?: boolean
    dimension?: boolean
    timestamp?: boolean
    caseId?: boolean
    userId?: boolean
    activityType?: boolean
    description?: boolean
  }, ExtArgs["result"]["analytics"]>



  export type AnalyticsSelectScalar = {
    id?: boolean
    metric?: boolean
    value?: boolean
    dimension?: boolean
    timestamp?: boolean
    caseId?: boolean
    userId?: boolean
    activityType?: boolean
    description?: boolean
  }

  export type AnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "metric" | "value" | "dimension" | "timestamp" | "caseId" | "userId" | "activityType" | "description", ExtArgs["result"]["analytics"]>

  export type $AnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analytics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      metric: string
      value: number
      dimension: string | null
      timestamp: Date
      caseId: string | null
      userId: string | null
      activityType: string | null
      description: string | null
    }, ExtArgs["result"]["analytics"]>
    composites: {}
  }

  type AnalyticsGetPayload<S extends boolean | null | undefined | AnalyticsDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsPayload, S>

  type AnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalyticsCountAggregateInputType | true
    }

  export interface AnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Analytics'], meta: { name: 'Analytics' } }
    /**
     * Find zero or one Analytics that matches the filter.
     * @param {AnalyticsFindUniqueArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsFindUniqueArgs>(args: SelectSubset<T, AnalyticsFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Analytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalyticsFindUniqueOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsFindFirstArgs>(args?: SelectSubset<T, AnalyticsFindFirstArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindFirstOrThrowArgs} args - Arguments to find a Analytics
     * @example
     * // Get one Analytics
     * const analytics = await prisma.analytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analytics
     * const analytics = await prisma.analytics.findMany()
     * 
     * // Get first 10 Analytics
     * const analytics = await prisma.analytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsWithIdOnly = await prisma.analytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsFindManyArgs>(args?: SelectSubset<T, AnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Analytics.
     * @param {AnalyticsCreateArgs} args - Arguments to create a Analytics.
     * @example
     * // Create one Analytics
     * const Analytics = await prisma.analytics.create({
     *   data: {
     *     // ... data to create a Analytics
     *   }
     * })
     * 
     */
    create<T extends AnalyticsCreateArgs>(args: SelectSubset<T, AnalyticsCreateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Analytics.
     * @param {AnalyticsCreateManyArgs} args - Arguments to create many Analytics.
     * @example
     * // Create many Analytics
     * const analytics = await prisma.analytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsCreateManyArgs>(args?: SelectSubset<T, AnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Analytics.
     * @param {AnalyticsDeleteArgs} args - Arguments to delete one Analytics.
     * @example
     * // Delete one Analytics
     * const Analytics = await prisma.analytics.delete({
     *   where: {
     *     // ... filter to delete one Analytics
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsDeleteArgs>(args: SelectSubset<T, AnalyticsDeleteArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Analytics.
     * @param {AnalyticsUpdateArgs} args - Arguments to update one Analytics.
     * @example
     * // Update one Analytics
     * const analytics = await prisma.analytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsUpdateArgs>(args: SelectSubset<T, AnalyticsUpdateArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Analytics.
     * @param {AnalyticsDeleteManyArgs} args - Arguments to filter Analytics to delete.
     * @example
     * // Delete a few Analytics
     * const { count } = await prisma.analytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsDeleteManyArgs>(args?: SelectSubset<T, AnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analytics
     * const analytics = await prisma.analytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsUpdateManyArgs>(args: SelectSubset<T, AnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Analytics.
     * @param {AnalyticsUpsertArgs} args - Arguments to update or create a Analytics.
     * @example
     * // Update or create a Analytics
     * const analytics = await prisma.analytics.upsert({
     *   create: {
     *     // ... data to create a Analytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analytics we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsUpsertArgs>(args: SelectSubset<T, AnalyticsUpsertArgs<ExtArgs>>): Prisma__AnalyticsClient<$Result.GetResult<Prisma.$AnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsCountArgs} args - Arguments to filter Analytics to count.
     * @example
     * // Count the number of Analytics
     * const count = await prisma.analytics.count({
     *   where: {
     *     // ... the filter for the Analytics we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsCountArgs>(
      args?: Subset<T, AnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsAggregateArgs>(args: Subset<T, AnalyticsAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsAggregateType<T>>

    /**
     * Group by Analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Analytics model
   */
  readonly fields: AnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Analytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Analytics model
   */
  interface AnalyticsFieldRefs {
    readonly id: FieldRef<"Analytics", 'String'>
    readonly metric: FieldRef<"Analytics", 'String'>
    readonly value: FieldRef<"Analytics", 'Float'>
    readonly dimension: FieldRef<"Analytics", 'String'>
    readonly timestamp: FieldRef<"Analytics", 'DateTime'>
    readonly caseId: FieldRef<"Analytics", 'String'>
    readonly userId: FieldRef<"Analytics", 'String'>
    readonly activityType: FieldRef<"Analytics", 'String'>
    readonly description: FieldRef<"Analytics", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Analytics findUnique
   */
  export type AnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findUniqueOrThrow
   */
  export type AnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics findFirst
   */
  export type AnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findFirstOrThrow
   */
  export type AnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analytics.
     */
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics findMany
   */
  export type AnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter, which Analytics to fetch.
     */
    where?: AnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analytics to fetch.
     */
    orderBy?: AnalyticsOrderByWithRelationInput | AnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Analytics.
     */
    cursor?: AnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analytics.
     */
    skip?: number
    distinct?: AnalyticsScalarFieldEnum | AnalyticsScalarFieldEnum[]
  }

  /**
   * Analytics create
   */
  export type AnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to create a Analytics.
     */
    data: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
  }

  /**
   * Analytics createMany
   */
  export type AnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Analytics.
     */
    data: AnalyticsCreateManyInput | AnalyticsCreateManyInput[]
  }

  /**
   * Analytics update
   */
  export type AnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The data needed to update a Analytics.
     */
    data: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
    /**
     * Choose, which Analytics to update.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics updateMany
   */
  export type AnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Analytics.
     */
    data: XOR<AnalyticsUpdateManyMutationInput, AnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which Analytics to update
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to update.
     */
    limit?: number
  }

  /**
   * Analytics upsert
   */
  export type AnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * The filter to search for the Analytics to update in case it exists.
     */
    where: AnalyticsWhereUniqueInput
    /**
     * In case the Analytics found by the `where` argument doesn't exist, create a new Analytics with this data.
     */
    create: XOR<AnalyticsCreateInput, AnalyticsUncheckedCreateInput>
    /**
     * In case the Analytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsUpdateInput, AnalyticsUncheckedUpdateInput>
  }

  /**
   * Analytics delete
   */
  export type AnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
    /**
     * Filter which Analytics to delete.
     */
    where: AnalyticsWhereUniqueInput
  }

  /**
   * Analytics deleteMany
   */
  export type AnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analytics to delete
     */
    where?: AnalyticsWhereInput
    /**
     * Limit how many Analytics to delete.
     */
    limit?: number
  }

  /**
   * Analytics without action
   */
  export type AnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analytics
     */
    select?: AnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analytics
     */
    omit?: AnalyticsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable',
    Snapshot: 'Snapshot'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    fullName: 'fullName',
    userRole: 'userRole'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const QueryScalarFieldEnum: {
    id: 'id',
    question: 'question',
    answer: 'answer',
    confidence: 'confidence',
    sources: 'sources',
    status: 'status',
    context: 'context',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QueryScalarFieldEnum = (typeof QueryScalarFieldEnum)[keyof typeof QueryScalarFieldEnum]


  export const CaseScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    priority: 'priority',
    assignedUserId: 'assignedUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    patientFhirId: 'patientFhirId',
    encounterFhirId: 'encounterFhirId',
    medicalRecordNumber: 'medicalRecordNumber',
    patientName: 'patientName',
    age: 'age',
    gender: 'gender',
    admissionDate: 'admissionDate',
    dischargeDate: 'dischargeDate',
    primaryDiagnosis: 'primaryDiagnosis',
    currentDRG: 'currentDRG',
    openDate: 'openDate',
    closeDate: 'closeDate',
    facilityId: 'facilityId'
  };

  export type CaseScalarFieldEnum = (typeof CaseScalarFieldEnum)[keyof typeof CaseScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    mrn: 'mrn',
    dob: 'dob',
    gender: 'gender',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const EncounterScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    caseId: 'caseId',
    encounterId: 'encounterId',
    chiefComplaint: 'chiefComplaint',
    admissionDate: 'admissionDate',
    dischargeDate: 'dischargeDate',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EncounterScalarFieldEnum = (typeof EncounterScalarFieldEnum)[keyof typeof EncounterScalarFieldEnum]


  export const DiagnosisScalarFieldEnum: {
    id: 'id',
    encounterId: 'encounterId',
    icdCode: 'icdCode',
    description: 'description',
    isPrimary: 'isPrimary'
  };

  export type DiagnosisScalarFieldEnum = (typeof DiagnosisScalarFieldEnum)[keyof typeof DiagnosisScalarFieldEnum]


  export const ProcedureScalarFieldEnum: {
    id: 'id',
    encounterId: 'encounterId',
    cptCode: 'cptCode',
    description: 'description'
  };

  export type ProcedureScalarFieldEnum = (typeof ProcedureScalarFieldEnum)[keyof typeof ProcedureScalarFieldEnum]


  export const PreBillAnalysisScalarFieldEnum: {
    id: 'id',
    encounterId: 'encounterId',
    confidence: 'confidence',
    recommendations: 'recommendations',
    riskFactors: 'riskFactors',
    notes: 'notes',
    status: 'status',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    potentialFinancialImpact: 'potentialFinancialImpact',
    description: 'description',
    evidenceId: 'evidenceId',
    embedding: 'embedding'
  };

  export type PreBillAnalysisScalarFieldEnum = (typeof PreBillAnalysisScalarFieldEnum)[keyof typeof PreBillAnalysisScalarFieldEnum]


  export const DenialScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    denialReason: 'denialReason',
    amount: 'amount',
    status: 'status',
    appealDate: 'appealDate',
    resolution: 'resolution',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    denialReasonCode: 'denialReasonCode',
    deniedAmount: 'deniedAmount',
    appealLetterDraft: 'appealLetterDraft',
    claimFhirId: 'claimFhirId'
  };

  export type DenialScalarFieldEnum = (typeof DenialScalarFieldEnum)[keyof typeof DenialScalarFieldEnum]


  export const AnalyticsScalarFieldEnum: {
    id: 'id',
    metric: 'metric',
    value: 'value',
    dimension: 'dimension',
    timestamp: 'timestamp',
    caseId: 'caseId',
    userId: 'userId',
    activityType: 'activityType',
    description: 'description'
  };

  export type AnalyticsScalarFieldEnum = (typeof AnalyticsScalarFieldEnum)[keyof typeof AnalyticsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    fullName?: StringNullableFilter<"User"> | string | null
    userRole?: StringNullableFilter<"User"> | string | null
    queries?: QueryListRelationFilter
    assignedCases?: CaseListRelationFilter
    preBillAnalyses?: PreBillAnalysisListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrderInput | SortOrder
    userRole?: SortOrderInput | SortOrder
    queries?: QueryOrderByRelationAggregateInput
    assignedCases?: CaseOrderByRelationAggregateInput
    preBillAnalyses?: PreBillAnalysisOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    fullName?: StringNullableFilter<"User"> | string | null
    userRole?: StringNullableFilter<"User"> | string | null
    queries?: QueryListRelationFilter
    assignedCases?: CaseListRelationFilter
    preBillAnalyses?: PreBillAnalysisListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrderInput | SortOrder
    userRole?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    fullName?: StringNullableWithAggregatesFilter<"User"> | string | null
    userRole?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type QueryWhereInput = {
    AND?: QueryWhereInput | QueryWhereInput[]
    OR?: QueryWhereInput[]
    NOT?: QueryWhereInput | QueryWhereInput[]
    id?: StringFilter<"Query"> | string
    question?: StringFilter<"Query"> | string
    answer?: StringNullableFilter<"Query"> | string | null
    confidence?: FloatNullableFilter<"Query"> | number | null
    sources?: StringNullableFilter<"Query"> | string | null
    status?: StringFilter<"Query"> | string
    context?: StringNullableFilter<"Query"> | string | null
    userId?: StringFilter<"Query"> | string
    createdAt?: DateTimeFilter<"Query"> | Date | string
    updatedAt?: DateTimeFilter<"Query"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type QueryOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    sources?: SortOrderInput | SortOrder
    status?: SortOrder
    context?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type QueryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QueryWhereInput | QueryWhereInput[]
    OR?: QueryWhereInput[]
    NOT?: QueryWhereInput | QueryWhereInput[]
    question?: StringFilter<"Query"> | string
    answer?: StringNullableFilter<"Query"> | string | null
    confidence?: FloatNullableFilter<"Query"> | number | null
    sources?: StringNullableFilter<"Query"> | string | null
    status?: StringFilter<"Query"> | string
    context?: StringNullableFilter<"Query"> | string | null
    userId?: StringFilter<"Query"> | string
    createdAt?: DateTimeFilter<"Query"> | Date | string
    updatedAt?: DateTimeFilter<"Query"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type QueryOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    sources?: SortOrderInput | SortOrder
    status?: SortOrder
    context?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QueryCountOrderByAggregateInput
    _avg?: QueryAvgOrderByAggregateInput
    _max?: QueryMaxOrderByAggregateInput
    _min?: QueryMinOrderByAggregateInput
    _sum?: QuerySumOrderByAggregateInput
  }

  export type QueryScalarWhereWithAggregatesInput = {
    AND?: QueryScalarWhereWithAggregatesInput | QueryScalarWhereWithAggregatesInput[]
    OR?: QueryScalarWhereWithAggregatesInput[]
    NOT?: QueryScalarWhereWithAggregatesInput | QueryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Query"> | string
    question?: StringWithAggregatesFilter<"Query"> | string
    answer?: StringNullableWithAggregatesFilter<"Query"> | string | null
    confidence?: FloatNullableWithAggregatesFilter<"Query"> | number | null
    sources?: StringNullableWithAggregatesFilter<"Query"> | string | null
    status?: StringWithAggregatesFilter<"Query"> | string
    context?: StringNullableWithAggregatesFilter<"Query"> | string | null
    userId?: StringWithAggregatesFilter<"Query"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Query"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Query"> | Date | string
  }

  export type CaseWhereInput = {
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    id?: StringFilter<"Case"> | string
    title?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    status?: StringFilter<"Case"> | string
    priority?: StringFilter<"Case"> | string
    assignedUserId?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    patientFhirId?: StringNullableFilter<"Case"> | string | null
    encounterFhirId?: StringNullableFilter<"Case"> | string | null
    medicalRecordNumber?: StringNullableFilter<"Case"> | string | null
    patientName?: StringNullableFilter<"Case"> | string | null
    age?: IntNullableFilter<"Case"> | number | null
    gender?: StringNullableFilter<"Case"> | string | null
    admissionDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    primaryDiagnosis?: StringNullableFilter<"Case"> | string | null
    currentDRG?: StringNullableFilter<"Case"> | string | null
    openDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    closeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    facilityId?: StringNullableFilter<"Case"> | string | null
    assignedUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    encounters?: EncounterListRelationFilter
    denials?: DenialListRelationFilter
  }

  export type CaseOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    assignedUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientFhirId?: SortOrderInput | SortOrder
    encounterFhirId?: SortOrderInput | SortOrder
    medicalRecordNumber?: SortOrderInput | SortOrder
    patientName?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    admissionDate?: SortOrderInput | SortOrder
    dischargeDate?: SortOrderInput | SortOrder
    primaryDiagnosis?: SortOrderInput | SortOrder
    currentDRG?: SortOrderInput | SortOrder
    openDate?: SortOrderInput | SortOrder
    closeDate?: SortOrderInput | SortOrder
    facilityId?: SortOrderInput | SortOrder
    assignedUser?: UserOrderByWithRelationInput
    encounters?: EncounterOrderByRelationAggregateInput
    denials?: DenialOrderByRelationAggregateInput
  }

  export type CaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CaseWhereInput | CaseWhereInput[]
    OR?: CaseWhereInput[]
    NOT?: CaseWhereInput | CaseWhereInput[]
    title?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    status?: StringFilter<"Case"> | string
    priority?: StringFilter<"Case"> | string
    assignedUserId?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    patientFhirId?: StringNullableFilter<"Case"> | string | null
    encounterFhirId?: StringNullableFilter<"Case"> | string | null
    medicalRecordNumber?: StringNullableFilter<"Case"> | string | null
    patientName?: StringNullableFilter<"Case"> | string | null
    age?: IntNullableFilter<"Case"> | number | null
    gender?: StringNullableFilter<"Case"> | string | null
    admissionDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    primaryDiagnosis?: StringNullableFilter<"Case"> | string | null
    currentDRG?: StringNullableFilter<"Case"> | string | null
    openDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    closeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    facilityId?: StringNullableFilter<"Case"> | string | null
    assignedUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    encounters?: EncounterListRelationFilter
    denials?: DenialListRelationFilter
  }, "id">

  export type CaseOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    assignedUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientFhirId?: SortOrderInput | SortOrder
    encounterFhirId?: SortOrderInput | SortOrder
    medicalRecordNumber?: SortOrderInput | SortOrder
    patientName?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    admissionDate?: SortOrderInput | SortOrder
    dischargeDate?: SortOrderInput | SortOrder
    primaryDiagnosis?: SortOrderInput | SortOrder
    currentDRG?: SortOrderInput | SortOrder
    openDate?: SortOrderInput | SortOrder
    closeDate?: SortOrderInput | SortOrder
    facilityId?: SortOrderInput | SortOrder
    _count?: CaseCountOrderByAggregateInput
    _avg?: CaseAvgOrderByAggregateInput
    _max?: CaseMaxOrderByAggregateInput
    _min?: CaseMinOrderByAggregateInput
    _sum?: CaseSumOrderByAggregateInput
  }

  export type CaseScalarWhereWithAggregatesInput = {
    AND?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    OR?: CaseScalarWhereWithAggregatesInput[]
    NOT?: CaseScalarWhereWithAggregatesInput | CaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Case"> | string
    title?: StringWithAggregatesFilter<"Case"> | string
    description?: StringNullableWithAggregatesFilter<"Case"> | string | null
    status?: StringWithAggregatesFilter<"Case"> | string
    priority?: StringWithAggregatesFilter<"Case"> | string
    assignedUserId?: StringNullableWithAggregatesFilter<"Case"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Case"> | Date | string
    patientFhirId?: StringNullableWithAggregatesFilter<"Case"> | string | null
    encounterFhirId?: StringNullableWithAggregatesFilter<"Case"> | string | null
    medicalRecordNumber?: StringNullableWithAggregatesFilter<"Case"> | string | null
    patientName?: StringNullableWithAggregatesFilter<"Case"> | string | null
    age?: IntNullableWithAggregatesFilter<"Case"> | number | null
    gender?: StringNullableWithAggregatesFilter<"Case"> | string | null
    admissionDate?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    dischargeDate?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    primaryDiagnosis?: StringNullableWithAggregatesFilter<"Case"> | string | null
    currentDRG?: StringNullableWithAggregatesFilter<"Case"> | string | null
    openDate?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    closeDate?: DateTimeNullableWithAggregatesFilter<"Case"> | Date | string | null
    facilityId?: StringNullableWithAggregatesFilter<"Case"> | string | null
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    name?: StringFilter<"Patient"> | string
    mrn?: StringFilter<"Patient"> | string
    dob?: DateTimeNullableFilter<"Patient"> | Date | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    encounters?: EncounterListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    mrn?: SortOrder
    dob?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    encounters?: EncounterOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mrn?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    name?: StringFilter<"Patient"> | string
    dob?: DateTimeNullableFilter<"Patient"> | Date | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    encounters?: EncounterListRelationFilter
  }, "id" | "mrn">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    mrn?: SortOrder
    dob?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    name?: StringWithAggregatesFilter<"Patient"> | string
    mrn?: StringWithAggregatesFilter<"Patient"> | string
    dob?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    gender?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type EncounterWhereInput = {
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    caseId?: StringNullableFilter<"Encounter"> | string | null
    encounterId?: StringFilter<"Encounter"> | string
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    admissionDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    status?: StringFilter<"Encounter"> | string
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    case?: XOR<CaseNullableScalarRelationFilter, CaseWhereInput> | null
    diagnoses?: DiagnosisListRelationFilter
    procedures?: ProcedureListRelationFilter
    preBillAnalyses?: PreBillAnalysisListRelationFilter
  }

  export type EncounterOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    caseId?: SortOrderInput | SortOrder
    encounterId?: SortOrder
    chiefComplaint?: SortOrderInput | SortOrder
    admissionDate?: SortOrderInput | SortOrder
    dischargeDate?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    case?: CaseOrderByWithRelationInput
    diagnoses?: DiagnosisOrderByRelationAggregateInput
    procedures?: ProcedureOrderByRelationAggregateInput
    preBillAnalyses?: PreBillAnalysisOrderByRelationAggregateInput
  }

  export type EncounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    encounterId?: string
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    patientId?: StringFilter<"Encounter"> | string
    caseId?: StringNullableFilter<"Encounter"> | string | null
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    admissionDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    status?: StringFilter<"Encounter"> | string
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    case?: XOR<CaseNullableScalarRelationFilter, CaseWhereInput> | null
    diagnoses?: DiagnosisListRelationFilter
    procedures?: ProcedureListRelationFilter
    preBillAnalyses?: PreBillAnalysisListRelationFilter
  }, "id" | "encounterId">

  export type EncounterOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    caseId?: SortOrderInput | SortOrder
    encounterId?: SortOrder
    chiefComplaint?: SortOrderInput | SortOrder
    admissionDate?: SortOrderInput | SortOrder
    dischargeDate?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EncounterCountOrderByAggregateInput
    _max?: EncounterMaxOrderByAggregateInput
    _min?: EncounterMinOrderByAggregateInput
  }

  export type EncounterScalarWhereWithAggregatesInput = {
    AND?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    OR?: EncounterScalarWhereWithAggregatesInput[]
    NOT?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Encounter"> | string
    patientId?: StringWithAggregatesFilter<"Encounter"> | string
    caseId?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    encounterId?: StringWithAggregatesFilter<"Encounter"> | string
    chiefComplaint?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    admissionDate?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    dischargeDate?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    status?: StringWithAggregatesFilter<"Encounter"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
  }

  export type DiagnosisWhereInput = {
    AND?: DiagnosisWhereInput | DiagnosisWhereInput[]
    OR?: DiagnosisWhereInput[]
    NOT?: DiagnosisWhereInput | DiagnosisWhereInput[]
    id?: StringFilter<"Diagnosis"> | string
    encounterId?: StringFilter<"Diagnosis"> | string
    icdCode?: StringFilter<"Diagnosis"> | string
    description?: StringFilter<"Diagnosis"> | string
    isPrimary?: BoolFilter<"Diagnosis"> | boolean
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
  }

  export type DiagnosisOrderByWithRelationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    icdCode?: SortOrder
    description?: SortOrder
    isPrimary?: SortOrder
    encounter?: EncounterOrderByWithRelationInput
  }

  export type DiagnosisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DiagnosisWhereInput | DiagnosisWhereInput[]
    OR?: DiagnosisWhereInput[]
    NOT?: DiagnosisWhereInput | DiagnosisWhereInput[]
    encounterId?: StringFilter<"Diagnosis"> | string
    icdCode?: StringFilter<"Diagnosis"> | string
    description?: StringFilter<"Diagnosis"> | string
    isPrimary?: BoolFilter<"Diagnosis"> | boolean
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
  }, "id">

  export type DiagnosisOrderByWithAggregationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    icdCode?: SortOrder
    description?: SortOrder
    isPrimary?: SortOrder
    _count?: DiagnosisCountOrderByAggregateInput
    _max?: DiagnosisMaxOrderByAggregateInput
    _min?: DiagnosisMinOrderByAggregateInput
  }

  export type DiagnosisScalarWhereWithAggregatesInput = {
    AND?: DiagnosisScalarWhereWithAggregatesInput | DiagnosisScalarWhereWithAggregatesInput[]
    OR?: DiagnosisScalarWhereWithAggregatesInput[]
    NOT?: DiagnosisScalarWhereWithAggregatesInput | DiagnosisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Diagnosis"> | string
    encounterId?: StringWithAggregatesFilter<"Diagnosis"> | string
    icdCode?: StringWithAggregatesFilter<"Diagnosis"> | string
    description?: StringWithAggregatesFilter<"Diagnosis"> | string
    isPrimary?: BoolWithAggregatesFilter<"Diagnosis"> | boolean
  }

  export type ProcedureWhereInput = {
    AND?: ProcedureWhereInput | ProcedureWhereInput[]
    OR?: ProcedureWhereInput[]
    NOT?: ProcedureWhereInput | ProcedureWhereInput[]
    id?: StringFilter<"Procedure"> | string
    encounterId?: StringFilter<"Procedure"> | string
    cptCode?: StringFilter<"Procedure"> | string
    description?: StringFilter<"Procedure"> | string
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
  }

  export type ProcedureOrderByWithRelationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    cptCode?: SortOrder
    description?: SortOrder
    encounter?: EncounterOrderByWithRelationInput
  }

  export type ProcedureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProcedureWhereInput | ProcedureWhereInput[]
    OR?: ProcedureWhereInput[]
    NOT?: ProcedureWhereInput | ProcedureWhereInput[]
    encounterId?: StringFilter<"Procedure"> | string
    cptCode?: StringFilter<"Procedure"> | string
    description?: StringFilter<"Procedure"> | string
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
  }, "id">

  export type ProcedureOrderByWithAggregationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    cptCode?: SortOrder
    description?: SortOrder
    _count?: ProcedureCountOrderByAggregateInput
    _max?: ProcedureMaxOrderByAggregateInput
    _min?: ProcedureMinOrderByAggregateInput
  }

  export type ProcedureScalarWhereWithAggregatesInput = {
    AND?: ProcedureScalarWhereWithAggregatesInput | ProcedureScalarWhereWithAggregatesInput[]
    OR?: ProcedureScalarWhereWithAggregatesInput[]
    NOT?: ProcedureScalarWhereWithAggregatesInput | ProcedureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Procedure"> | string
    encounterId?: StringWithAggregatesFilter<"Procedure"> | string
    cptCode?: StringWithAggregatesFilter<"Procedure"> | string
    description?: StringWithAggregatesFilter<"Procedure"> | string
  }

  export type PreBillAnalysisWhereInput = {
    AND?: PreBillAnalysisWhereInput | PreBillAnalysisWhereInput[]
    OR?: PreBillAnalysisWhereInput[]
    NOT?: PreBillAnalysisWhereInput | PreBillAnalysisWhereInput[]
    id?: StringFilter<"PreBillAnalysis"> | string
    encounterId?: StringFilter<"PreBillAnalysis"> | string
    confidence?: FloatFilter<"PreBillAnalysis"> | number
    recommendations?: StringFilter<"PreBillAnalysis"> | string
    riskFactors?: StringNullableFilter<"PreBillAnalysis"> | string | null
    notes?: StringNullableFilter<"PreBillAnalysis"> | string | null
    status?: StringFilter<"PreBillAnalysis"> | string
    userId?: StringNullableFilter<"PreBillAnalysis"> | string | null
    createdAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    potentialFinancialImpact?: FloatNullableFilter<"PreBillAnalysis"> | number | null
    description?: StringNullableFilter<"PreBillAnalysis"> | string | null
    evidenceId?: StringNullableFilter<"PreBillAnalysis"> | string | null
    embedding?: StringNullableFilter<"PreBillAnalysis"> | string | null
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PreBillAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    confidence?: SortOrder
    recommendations?: SortOrder
    riskFactors?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    potentialFinancialImpact?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    evidenceId?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    encounter?: EncounterOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type PreBillAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    evidenceId?: string
    AND?: PreBillAnalysisWhereInput | PreBillAnalysisWhereInput[]
    OR?: PreBillAnalysisWhereInput[]
    NOT?: PreBillAnalysisWhereInput | PreBillAnalysisWhereInput[]
    encounterId?: StringFilter<"PreBillAnalysis"> | string
    confidence?: FloatFilter<"PreBillAnalysis"> | number
    recommendations?: StringFilter<"PreBillAnalysis"> | string
    riskFactors?: StringNullableFilter<"PreBillAnalysis"> | string | null
    notes?: StringNullableFilter<"PreBillAnalysis"> | string | null
    status?: StringFilter<"PreBillAnalysis"> | string
    userId?: StringNullableFilter<"PreBillAnalysis"> | string | null
    createdAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    potentialFinancialImpact?: FloatNullableFilter<"PreBillAnalysis"> | number | null
    description?: StringNullableFilter<"PreBillAnalysis"> | string | null
    embedding?: StringNullableFilter<"PreBillAnalysis"> | string | null
    encounter?: XOR<EncounterScalarRelationFilter, EncounterWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "evidenceId">

  export type PreBillAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    encounterId?: SortOrder
    confidence?: SortOrder
    recommendations?: SortOrder
    riskFactors?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    potentialFinancialImpact?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    evidenceId?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    _count?: PreBillAnalysisCountOrderByAggregateInput
    _avg?: PreBillAnalysisAvgOrderByAggregateInput
    _max?: PreBillAnalysisMaxOrderByAggregateInput
    _min?: PreBillAnalysisMinOrderByAggregateInput
    _sum?: PreBillAnalysisSumOrderByAggregateInput
  }

  export type PreBillAnalysisScalarWhereWithAggregatesInput = {
    AND?: PreBillAnalysisScalarWhereWithAggregatesInput | PreBillAnalysisScalarWhereWithAggregatesInput[]
    OR?: PreBillAnalysisScalarWhereWithAggregatesInput[]
    NOT?: PreBillAnalysisScalarWhereWithAggregatesInput | PreBillAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PreBillAnalysis"> | string
    encounterId?: StringWithAggregatesFilter<"PreBillAnalysis"> | string
    confidence?: FloatWithAggregatesFilter<"PreBillAnalysis"> | number
    recommendations?: StringWithAggregatesFilter<"PreBillAnalysis"> | string
    riskFactors?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
    notes?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
    status?: StringWithAggregatesFilter<"PreBillAnalysis"> | string
    userId?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PreBillAnalysis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PreBillAnalysis"> | Date | string
    potentialFinancialImpact?: FloatNullableWithAggregatesFilter<"PreBillAnalysis"> | number | null
    description?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
    evidenceId?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
    embedding?: StringNullableWithAggregatesFilter<"PreBillAnalysis"> | string | null
  }

  export type DenialWhereInput = {
    AND?: DenialWhereInput | DenialWhereInput[]
    OR?: DenialWhereInput[]
    NOT?: DenialWhereInput | DenialWhereInput[]
    id?: StringFilter<"Denial"> | string
    caseId?: StringNullableFilter<"Denial"> | string | null
    denialReason?: StringFilter<"Denial"> | string
    amount?: FloatFilter<"Denial"> | number
    status?: StringFilter<"Denial"> | string
    appealDate?: DateTimeNullableFilter<"Denial"> | Date | string | null
    resolution?: StringNullableFilter<"Denial"> | string | null
    createdAt?: DateTimeFilter<"Denial"> | Date | string
    updatedAt?: DateTimeFilter<"Denial"> | Date | string
    denialReasonCode?: StringNullableFilter<"Denial"> | string | null
    deniedAmount?: FloatNullableFilter<"Denial"> | number | null
    appealLetterDraft?: StringNullableFilter<"Denial"> | string | null
    claimFhirId?: StringNullableFilter<"Denial"> | string | null
    case?: XOR<CaseNullableScalarRelationFilter, CaseWhereInput> | null
  }

  export type DenialOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrderInput | SortOrder
    denialReason?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    appealDate?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denialReasonCode?: SortOrderInput | SortOrder
    deniedAmount?: SortOrderInput | SortOrder
    appealLetterDraft?: SortOrderInput | SortOrder
    claimFhirId?: SortOrderInput | SortOrder
    case?: CaseOrderByWithRelationInput
  }

  export type DenialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DenialWhereInput | DenialWhereInput[]
    OR?: DenialWhereInput[]
    NOT?: DenialWhereInput | DenialWhereInput[]
    caseId?: StringNullableFilter<"Denial"> | string | null
    denialReason?: StringFilter<"Denial"> | string
    amount?: FloatFilter<"Denial"> | number
    status?: StringFilter<"Denial"> | string
    appealDate?: DateTimeNullableFilter<"Denial"> | Date | string | null
    resolution?: StringNullableFilter<"Denial"> | string | null
    createdAt?: DateTimeFilter<"Denial"> | Date | string
    updatedAt?: DateTimeFilter<"Denial"> | Date | string
    denialReasonCode?: StringNullableFilter<"Denial"> | string | null
    deniedAmount?: FloatNullableFilter<"Denial"> | number | null
    appealLetterDraft?: StringNullableFilter<"Denial"> | string | null
    claimFhirId?: StringNullableFilter<"Denial"> | string | null
    case?: XOR<CaseNullableScalarRelationFilter, CaseWhereInput> | null
  }, "id">

  export type DenialOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrderInput | SortOrder
    denialReason?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    appealDate?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denialReasonCode?: SortOrderInput | SortOrder
    deniedAmount?: SortOrderInput | SortOrder
    appealLetterDraft?: SortOrderInput | SortOrder
    claimFhirId?: SortOrderInput | SortOrder
    _count?: DenialCountOrderByAggregateInput
    _avg?: DenialAvgOrderByAggregateInput
    _max?: DenialMaxOrderByAggregateInput
    _min?: DenialMinOrderByAggregateInput
    _sum?: DenialSumOrderByAggregateInput
  }

  export type DenialScalarWhereWithAggregatesInput = {
    AND?: DenialScalarWhereWithAggregatesInput | DenialScalarWhereWithAggregatesInput[]
    OR?: DenialScalarWhereWithAggregatesInput[]
    NOT?: DenialScalarWhereWithAggregatesInput | DenialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Denial"> | string
    caseId?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    denialReason?: StringWithAggregatesFilter<"Denial"> | string
    amount?: FloatWithAggregatesFilter<"Denial"> | number
    status?: StringWithAggregatesFilter<"Denial"> | string
    appealDate?: DateTimeNullableWithAggregatesFilter<"Denial"> | Date | string | null
    resolution?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Denial"> | Date | string
    denialReasonCode?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    deniedAmount?: FloatNullableWithAggregatesFilter<"Denial"> | number | null
    appealLetterDraft?: StringNullableWithAggregatesFilter<"Denial"> | string | null
    claimFhirId?: StringNullableWithAggregatesFilter<"Denial"> | string | null
  }

  export type AnalyticsWhereInput = {
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    id?: StringFilter<"Analytics"> | string
    metric?: StringFilter<"Analytics"> | string
    value?: FloatFilter<"Analytics"> | number
    dimension?: StringNullableFilter<"Analytics"> | string | null
    timestamp?: DateTimeFilter<"Analytics"> | Date | string
    caseId?: StringNullableFilter<"Analytics"> | string | null
    userId?: StringNullableFilter<"Analytics"> | string | null
    activityType?: StringNullableFilter<"Analytics"> | string | null
    description?: StringNullableFilter<"Analytics"> | string | null
  }

  export type AnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    dimension?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    caseId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    activityType?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
  }

  export type AnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalyticsWhereInput | AnalyticsWhereInput[]
    OR?: AnalyticsWhereInput[]
    NOT?: AnalyticsWhereInput | AnalyticsWhereInput[]
    metric?: StringFilter<"Analytics"> | string
    value?: FloatFilter<"Analytics"> | number
    dimension?: StringNullableFilter<"Analytics"> | string | null
    timestamp?: DateTimeFilter<"Analytics"> | Date | string
    caseId?: StringNullableFilter<"Analytics"> | string | null
    userId?: StringNullableFilter<"Analytics"> | string | null
    activityType?: StringNullableFilter<"Analytics"> | string | null
    description?: StringNullableFilter<"Analytics"> | string | null
  }, "id">

  export type AnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    dimension?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    caseId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    activityType?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    _count?: AnalyticsCountOrderByAggregateInput
    _avg?: AnalyticsAvgOrderByAggregateInput
    _max?: AnalyticsMaxOrderByAggregateInput
    _min?: AnalyticsMinOrderByAggregateInput
    _sum?: AnalyticsSumOrderByAggregateInput
  }

  export type AnalyticsScalarWhereWithAggregatesInput = {
    AND?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    OR?: AnalyticsScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsScalarWhereWithAggregatesInput | AnalyticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Analytics"> | string
    metric?: StringWithAggregatesFilter<"Analytics"> | string
    value?: FloatWithAggregatesFilter<"Analytics"> | number
    dimension?: StringNullableWithAggregatesFilter<"Analytics"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"Analytics"> | Date | string
    caseId?: StringNullableWithAggregatesFilter<"Analytics"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Analytics"> | string | null
    activityType?: StringNullableWithAggregatesFilter<"Analytics"> | string | null
    description?: StringNullableWithAggregatesFilter<"Analytics"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryCreateNestedManyWithoutUserInput
    assignedCases?: CaseCreateNestedManyWithoutAssignedUserInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryUncheckedCreateNestedManyWithoutUserInput
    assignedCases?: CaseUncheckedCreateNestedManyWithoutAssignedUserInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUpdateManyWithoutUserNestedInput
    assignedCases?: CaseUpdateManyWithoutAssignedUserNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUncheckedUpdateManyWithoutUserNestedInput
    assignedCases?: CaseUncheckedUpdateManyWithoutAssignedUserNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueryCreateInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutQueriesInput
  }

  export type QueryUncheckedCreateInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutQueriesNestedInput
  }

  export type QueryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueryCreateManyInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    assignedUser?: UserCreateNestedOneWithoutAssignedCasesInput
    encounters?: EncounterCreateNestedManyWithoutCaseInput
    denials?: DenialCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    assignedUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    encounters?: EncounterUncheckedCreateNestedManyWithoutCaseInput
    denials?: DenialUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedUser?: UserUpdateOneWithoutAssignedCasesNestedInput
    encounters?: EncounterUpdateManyWithoutCaseNestedInput
    denials?: DenialUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    assignedUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    encounters?: EncounterUncheckedUpdateManyWithoutCaseNestedInput
    denials?: DenialUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    assignedUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
  }

  export type CaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    assignedUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientCreateInput = {
    id?: string
    name: string
    mrn: string
    dob?: Date | string | null
    gender?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    name: string
    mrn: string
    dob?: Date | string | null
    gender?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    name: string
    mrn: string
    dob?: Date | string | null
    gender?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    case?: CaseCreateNestedOneWithoutEncountersInput
    diagnoses?: DiagnosisCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateInput = {
    id?: string
    patientId: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureUncheckedCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    case?: CaseUpdateOneWithoutEncountersNestedInput
    diagnoses?: DiagnosisUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUncheckedUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterCreateManyInput = {
    id?: string
    patientId: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisCreateInput = {
    id?: string
    icdCode: string
    description: string
    isPrimary?: boolean
    encounter: EncounterCreateNestedOneWithoutDiagnosesInput
  }

  export type DiagnosisUncheckedCreateInput = {
    id?: string
    encounterId: string
    icdCode: string
    description: string
    isPrimary?: boolean
  }

  export type DiagnosisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    encounter?: EncounterUpdateOneRequiredWithoutDiagnosesNestedInput
  }

  export type DiagnosisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DiagnosisCreateManyInput = {
    id?: string
    encounterId: string
    icdCode: string
    description: string
    isPrimary?: boolean
  }

  export type DiagnosisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DiagnosisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProcedureCreateInput = {
    id?: string
    cptCode: string
    description: string
    encounter: EncounterCreateNestedOneWithoutProceduresInput
  }

  export type ProcedureUncheckedCreateInput = {
    id?: string
    encounterId: string
    cptCode: string
    description: string
  }

  export type ProcedureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    encounter?: EncounterUpdateOneRequiredWithoutProceduresNestedInput
  }

  export type ProcedureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ProcedureCreateManyInput = {
    id?: string
    encounterId: string
    cptCode: string
    description: string
  }

  export type ProcedureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ProcedureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type PreBillAnalysisCreateInput = {
    id?: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
    encounter: EncounterCreateNestedOneWithoutPreBillAnalysesInput
    user?: UserCreateNestedOneWithoutPreBillAnalysesInput
  }

  export type PreBillAnalysisUncheckedCreateInput = {
    id?: string
    encounterId: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type PreBillAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    encounter?: EncounterUpdateOneRequiredWithoutPreBillAnalysesNestedInput
    user?: UserUpdateOneWithoutPreBillAnalysesNestedInput
  }

  export type PreBillAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PreBillAnalysisCreateManyInput = {
    id?: string
    encounterId: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type PreBillAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PreBillAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DenialCreateInput = {
    id?: string
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
    case?: CaseCreateNestedOneWithoutDenialsInput
  }

  export type DenialUncheckedCreateInput = {
    id?: string
    caseId?: string | null
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
  }

  export type DenialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    case?: CaseUpdateOneWithoutDenialsNestedInput
  }

  export type DenialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DenialCreateManyInput = {
    id?: string
    caseId?: string | null
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
  }

  export type DenialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DenialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalyticsCreateInput = {
    id?: string
    metric: string
    value: number
    dimension?: string | null
    timestamp?: Date | string
    caseId?: string | null
    userId?: string | null
    activityType?: string | null
    description?: string | null
  }

  export type AnalyticsUncheckedCreateInput = {
    id?: string
    metric: string
    value: number
    dimension?: string | null
    timestamp?: Date | string
    caseId?: string | null
    userId?: string | null
    activityType?: string | null
    description?: string | null
  }

  export type AnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    activityType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    activityType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalyticsCreateManyInput = {
    id?: string
    metric: string
    value: number
    dimension?: string | null
    timestamp?: Date | string
    caseId?: string | null
    userId?: string | null
    activityType?: string | null
    description?: string | null
  }

  export type AnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    activityType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    activityType?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type QueryListRelationFilter = {
    every?: QueryWhereInput
    some?: QueryWhereInput
    none?: QueryWhereInput
  }

  export type CaseListRelationFilter = {
    every?: CaseWhereInput
    some?: CaseWhereInput
    none?: CaseWhereInput
  }

  export type PreBillAnalysisListRelationFilter = {
    every?: PreBillAnalysisWhereInput
    some?: PreBillAnalysisWhereInput
    none?: PreBillAnalysisWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QueryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PreBillAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    userRole?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    userRole?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fullName?: SortOrder
    userRole?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type QueryCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    confidence?: SortOrder
    sources?: SortOrder
    status?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueryAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type QueryMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    confidence?: SortOrder
    sources?: SortOrder
    status?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueryMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    confidence?: SortOrder
    sources?: SortOrder
    status?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuerySumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type EncounterListRelationFilter = {
    every?: EncounterWhereInput
    some?: EncounterWhereInput
    none?: EncounterWhereInput
  }

  export type DenialListRelationFilter = {
    every?: DenialWhereInput
    some?: DenialWhereInput
    none?: DenialWhereInput
  }

  export type EncounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DenialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    assignedUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientFhirId?: SortOrder
    encounterFhirId?: SortOrder
    medicalRecordNumber?: SortOrder
    patientName?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    primaryDiagnosis?: SortOrder
    currentDRG?: SortOrder
    openDate?: SortOrder
    closeDate?: SortOrder
    facilityId?: SortOrder
  }

  export type CaseAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type CaseMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    assignedUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientFhirId?: SortOrder
    encounterFhirId?: SortOrder
    medicalRecordNumber?: SortOrder
    patientName?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    primaryDiagnosis?: SortOrder
    currentDRG?: SortOrder
    openDate?: SortOrder
    closeDate?: SortOrder
    facilityId?: SortOrder
  }

  export type CaseMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    assignedUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patientFhirId?: SortOrder
    encounterFhirId?: SortOrder
    medicalRecordNumber?: SortOrder
    patientName?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    primaryDiagnosis?: SortOrder
    currentDRG?: SortOrder
    openDate?: SortOrder
    closeDate?: SortOrder
    facilityId?: SortOrder
  }

  export type CaseSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mrn?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mrn?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mrn?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientScalarRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type CaseNullableScalarRelationFilter = {
    is?: CaseWhereInput | null
    isNot?: CaseWhereInput | null
  }

  export type DiagnosisListRelationFilter = {
    every?: DiagnosisWhereInput
    some?: DiagnosisWhereInput
    none?: DiagnosisWhereInput
  }

  export type ProcedureListRelationFilter = {
    every?: ProcedureWhereInput
    some?: ProcedureWhereInput
    none?: ProcedureWhereInput
  }

  export type DiagnosisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProcedureOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EncounterCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    caseId?: SortOrder
    encounterId?: SortOrder
    chiefComplaint?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    caseId?: SortOrder
    encounterId?: SortOrder
    chiefComplaint?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    caseId?: SortOrder
    encounterId?: SortOrder
    chiefComplaint?: SortOrder
    admissionDate?: SortOrder
    dischargeDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EncounterScalarRelationFilter = {
    is?: EncounterWhereInput
    isNot?: EncounterWhereInput
  }

  export type DiagnosisCountOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    icdCode?: SortOrder
    description?: SortOrder
    isPrimary?: SortOrder
  }

  export type DiagnosisMaxOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    icdCode?: SortOrder
    description?: SortOrder
    isPrimary?: SortOrder
  }

  export type DiagnosisMinOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    icdCode?: SortOrder
    description?: SortOrder
    isPrimary?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProcedureCountOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    cptCode?: SortOrder
    description?: SortOrder
  }

  export type ProcedureMaxOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    cptCode?: SortOrder
    description?: SortOrder
  }

  export type ProcedureMinOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    cptCode?: SortOrder
    description?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PreBillAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    confidence?: SortOrder
    recommendations?: SortOrder
    riskFactors?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    potentialFinancialImpact?: SortOrder
    description?: SortOrder
    evidenceId?: SortOrder
    embedding?: SortOrder
  }

  export type PreBillAnalysisAvgOrderByAggregateInput = {
    confidence?: SortOrder
    potentialFinancialImpact?: SortOrder
  }

  export type PreBillAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    confidence?: SortOrder
    recommendations?: SortOrder
    riskFactors?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    potentialFinancialImpact?: SortOrder
    description?: SortOrder
    evidenceId?: SortOrder
    embedding?: SortOrder
  }

  export type PreBillAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    encounterId?: SortOrder
    confidence?: SortOrder
    recommendations?: SortOrder
    riskFactors?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    potentialFinancialImpact?: SortOrder
    description?: SortOrder
    evidenceId?: SortOrder
    embedding?: SortOrder
  }

  export type PreBillAnalysisSumOrderByAggregateInput = {
    confidence?: SortOrder
    potentialFinancialImpact?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DenialCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    denialReason?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    appealDate?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denialReasonCode?: SortOrder
    deniedAmount?: SortOrder
    appealLetterDraft?: SortOrder
    claimFhirId?: SortOrder
  }

  export type DenialAvgOrderByAggregateInput = {
    amount?: SortOrder
    deniedAmount?: SortOrder
  }

  export type DenialMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    denialReason?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    appealDate?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denialReasonCode?: SortOrder
    deniedAmount?: SortOrder
    appealLetterDraft?: SortOrder
    claimFhirId?: SortOrder
  }

  export type DenialMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    denialReason?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    appealDate?: SortOrder
    resolution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    denialReasonCode?: SortOrder
    deniedAmount?: SortOrder
    appealLetterDraft?: SortOrder
    claimFhirId?: SortOrder
  }

  export type DenialSumOrderByAggregateInput = {
    amount?: SortOrder
    deniedAmount?: SortOrder
  }

  export type AnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    dimension?: SortOrder
    timestamp?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
  }

  export type AnalyticsAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type AnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    dimension?: SortOrder
    timestamp?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
  }

  export type AnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    metric?: SortOrder
    value?: SortOrder
    dimension?: SortOrder
    timestamp?: SortOrder
    caseId?: SortOrder
    userId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
  }

  export type AnalyticsSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type QueryCreateNestedManyWithoutUserInput = {
    create?: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput> | QueryCreateWithoutUserInput[] | QueryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QueryCreateOrConnectWithoutUserInput | QueryCreateOrConnectWithoutUserInput[]
    createMany?: QueryCreateManyUserInputEnvelope
    connect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
  }

  export type CaseCreateNestedManyWithoutAssignedUserInput = {
    create?: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput> | CaseCreateWithoutAssignedUserInput[] | CaseUncheckedCreateWithoutAssignedUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutAssignedUserInput | CaseCreateOrConnectWithoutAssignedUserInput[]
    createMany?: CaseCreateManyAssignedUserInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type PreBillAnalysisCreateNestedManyWithoutUserInput = {
    create?: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput> | PreBillAnalysisCreateWithoutUserInput[] | PreBillAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutUserInput | PreBillAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: PreBillAnalysisCreateManyUserInputEnvelope
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
  }

  export type QueryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput> | QueryCreateWithoutUserInput[] | QueryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QueryCreateOrConnectWithoutUserInput | QueryCreateOrConnectWithoutUserInput[]
    createMany?: QueryCreateManyUserInputEnvelope
    connect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
  }

  export type CaseUncheckedCreateNestedManyWithoutAssignedUserInput = {
    create?: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput> | CaseCreateWithoutAssignedUserInput[] | CaseUncheckedCreateWithoutAssignedUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutAssignedUserInput | CaseCreateOrConnectWithoutAssignedUserInput[]
    createMany?: CaseCreateManyAssignedUserInputEnvelope
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
  }

  export type PreBillAnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput> | PreBillAnalysisCreateWithoutUserInput[] | PreBillAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutUserInput | PreBillAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: PreBillAnalysisCreateManyUserInputEnvelope
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type QueryUpdateManyWithoutUserNestedInput = {
    create?: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput> | QueryCreateWithoutUserInput[] | QueryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QueryCreateOrConnectWithoutUserInput | QueryCreateOrConnectWithoutUserInput[]
    upsert?: QueryUpsertWithWhereUniqueWithoutUserInput | QueryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QueryCreateManyUserInputEnvelope
    set?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    disconnect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    delete?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    connect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    update?: QueryUpdateWithWhereUniqueWithoutUserInput | QueryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QueryUpdateManyWithWhereWithoutUserInput | QueryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QueryScalarWhereInput | QueryScalarWhereInput[]
  }

  export type CaseUpdateManyWithoutAssignedUserNestedInput = {
    create?: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput> | CaseCreateWithoutAssignedUserInput[] | CaseUncheckedCreateWithoutAssignedUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutAssignedUserInput | CaseCreateOrConnectWithoutAssignedUserInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutAssignedUserInput | CaseUpsertWithWhereUniqueWithoutAssignedUserInput[]
    createMany?: CaseCreateManyAssignedUserInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutAssignedUserInput | CaseUpdateWithWhereUniqueWithoutAssignedUserInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutAssignedUserInput | CaseUpdateManyWithWhereWithoutAssignedUserInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type PreBillAnalysisUpdateManyWithoutUserNestedInput = {
    create?: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput> | PreBillAnalysisCreateWithoutUserInput[] | PreBillAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutUserInput | PreBillAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: PreBillAnalysisUpsertWithWhereUniqueWithoutUserInput | PreBillAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PreBillAnalysisCreateManyUserInputEnvelope
    set?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    disconnect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    delete?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    update?: PreBillAnalysisUpdateWithWhereUniqueWithoutUserInput | PreBillAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PreBillAnalysisUpdateManyWithWhereWithoutUserInput | PreBillAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
  }

  export type QueryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput> | QueryCreateWithoutUserInput[] | QueryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QueryCreateOrConnectWithoutUserInput | QueryCreateOrConnectWithoutUserInput[]
    upsert?: QueryUpsertWithWhereUniqueWithoutUserInput | QueryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QueryCreateManyUserInputEnvelope
    set?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    disconnect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    delete?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    connect?: QueryWhereUniqueInput | QueryWhereUniqueInput[]
    update?: QueryUpdateWithWhereUniqueWithoutUserInput | QueryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QueryUpdateManyWithWhereWithoutUserInput | QueryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QueryScalarWhereInput | QueryScalarWhereInput[]
  }

  export type CaseUncheckedUpdateManyWithoutAssignedUserNestedInput = {
    create?: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput> | CaseCreateWithoutAssignedUserInput[] | CaseUncheckedCreateWithoutAssignedUserInput[]
    connectOrCreate?: CaseCreateOrConnectWithoutAssignedUserInput | CaseCreateOrConnectWithoutAssignedUserInput[]
    upsert?: CaseUpsertWithWhereUniqueWithoutAssignedUserInput | CaseUpsertWithWhereUniqueWithoutAssignedUserInput[]
    createMany?: CaseCreateManyAssignedUserInputEnvelope
    set?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    disconnect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    delete?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    connect?: CaseWhereUniqueInput | CaseWhereUniqueInput[]
    update?: CaseUpdateWithWhereUniqueWithoutAssignedUserInput | CaseUpdateWithWhereUniqueWithoutAssignedUserInput[]
    updateMany?: CaseUpdateManyWithWhereWithoutAssignedUserInput | CaseUpdateManyWithWhereWithoutAssignedUserInput[]
    deleteMany?: CaseScalarWhereInput | CaseScalarWhereInput[]
  }

  export type PreBillAnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput> | PreBillAnalysisCreateWithoutUserInput[] | PreBillAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutUserInput | PreBillAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: PreBillAnalysisUpsertWithWhereUniqueWithoutUserInput | PreBillAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PreBillAnalysisCreateManyUserInputEnvelope
    set?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    disconnect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    delete?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    update?: PreBillAnalysisUpdateWithWhereUniqueWithoutUserInput | PreBillAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PreBillAnalysisUpdateManyWithWhereWithoutUserInput | PreBillAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutQueriesInput = {
    create?: XOR<UserCreateWithoutQueriesInput, UserUncheckedCreateWithoutQueriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutQueriesInput
    connect?: UserWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutQueriesNestedInput = {
    create?: XOR<UserCreateWithoutQueriesInput, UserUncheckedCreateWithoutQueriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutQueriesInput
    upsert?: UserUpsertWithoutQueriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQueriesInput, UserUpdateWithoutQueriesInput>, UserUncheckedUpdateWithoutQueriesInput>
  }

  export type UserCreateNestedOneWithoutAssignedCasesInput = {
    create?: XOR<UserCreateWithoutAssignedCasesInput, UserUncheckedCreateWithoutAssignedCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedCasesInput
    connect?: UserWhereUniqueInput
  }

  export type EncounterCreateNestedManyWithoutCaseInput = {
    create?: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput> | EncounterCreateWithoutCaseInput[] | EncounterUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutCaseInput | EncounterCreateOrConnectWithoutCaseInput[]
    createMany?: EncounterCreateManyCaseInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type DenialCreateNestedManyWithoutCaseInput = {
    create?: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput> | DenialCreateWithoutCaseInput[] | DenialUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: DenialCreateOrConnectWithoutCaseInput | DenialCreateOrConnectWithoutCaseInput[]
    createMany?: DenialCreateManyCaseInputEnvelope
    connect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput> | EncounterCreateWithoutCaseInput[] | EncounterUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutCaseInput | EncounterCreateOrConnectWithoutCaseInput[]
    createMany?: EncounterCreateManyCaseInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type DenialUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput> | DenialCreateWithoutCaseInput[] | DenialUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: DenialCreateOrConnectWithoutCaseInput | DenialCreateOrConnectWithoutCaseInput[]
    createMany?: DenialCreateManyCaseInputEnvelope
    connect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneWithoutAssignedCasesNestedInput = {
    create?: XOR<UserCreateWithoutAssignedCasesInput, UserUncheckedCreateWithoutAssignedCasesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignedCasesInput
    upsert?: UserUpsertWithoutAssignedCasesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssignedCasesInput, UserUpdateWithoutAssignedCasesInput>, UserUncheckedUpdateWithoutAssignedCasesInput>
  }

  export type EncounterUpdateManyWithoutCaseNestedInput = {
    create?: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput> | EncounterCreateWithoutCaseInput[] | EncounterUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutCaseInput | EncounterCreateOrConnectWithoutCaseInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutCaseInput | EncounterUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: EncounterCreateManyCaseInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutCaseInput | EncounterUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutCaseInput | EncounterUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type DenialUpdateManyWithoutCaseNestedInput = {
    create?: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput> | DenialCreateWithoutCaseInput[] | DenialUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: DenialCreateOrConnectWithoutCaseInput | DenialCreateOrConnectWithoutCaseInput[]
    upsert?: DenialUpsertWithWhereUniqueWithoutCaseInput | DenialUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: DenialCreateManyCaseInputEnvelope
    set?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    disconnect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    delete?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    connect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    update?: DenialUpdateWithWhereUniqueWithoutCaseInput | DenialUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: DenialUpdateManyWithWhereWithoutCaseInput | DenialUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: DenialScalarWhereInput | DenialScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput> | EncounterCreateWithoutCaseInput[] | EncounterUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutCaseInput | EncounterCreateOrConnectWithoutCaseInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutCaseInput | EncounterUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: EncounterCreateManyCaseInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutCaseInput | EncounterUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutCaseInput | EncounterUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type DenialUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput> | DenialCreateWithoutCaseInput[] | DenialUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: DenialCreateOrConnectWithoutCaseInput | DenialCreateOrConnectWithoutCaseInput[]
    upsert?: DenialUpsertWithWhereUniqueWithoutCaseInput | DenialUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: DenialCreateManyCaseInputEnvelope
    set?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    disconnect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    delete?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    connect?: DenialWhereUniqueInput | DenialWhereUniqueInput[]
    update?: DenialUpdateWithWhereUniqueWithoutCaseInput | DenialUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: DenialUpdateManyWithWhereWithoutCaseInput | DenialUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: DenialScalarWhereInput | DenialScalarWhereInput[]
  }

  export type EncounterCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type EncounterUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutEncountersInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    connect?: PatientWhereUniqueInput
  }

  export type CaseCreateNestedOneWithoutEncountersInput = {
    create?: XOR<CaseCreateWithoutEncountersInput, CaseUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: CaseCreateOrConnectWithoutEncountersInput
    connect?: CaseWhereUniqueInput
  }

  export type DiagnosisCreateNestedManyWithoutEncounterInput = {
    create?: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput> | DiagnosisCreateWithoutEncounterInput[] | DiagnosisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEncounterInput | DiagnosisCreateOrConnectWithoutEncounterInput[]
    createMany?: DiagnosisCreateManyEncounterInputEnvelope
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
  }

  export type ProcedureCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput> | ProcedureCreateWithoutEncounterInput[] | ProcedureUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ProcedureCreateOrConnectWithoutEncounterInput | ProcedureCreateOrConnectWithoutEncounterInput[]
    createMany?: ProcedureCreateManyEncounterInputEnvelope
    connect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
  }

  export type PreBillAnalysisCreateNestedManyWithoutEncounterInput = {
    create?: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput> | PreBillAnalysisCreateWithoutEncounterInput[] | PreBillAnalysisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutEncounterInput | PreBillAnalysisCreateOrConnectWithoutEncounterInput[]
    createMany?: PreBillAnalysisCreateManyEncounterInputEnvelope
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
  }

  export type DiagnosisUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput> | DiagnosisCreateWithoutEncounterInput[] | DiagnosisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEncounterInput | DiagnosisCreateOrConnectWithoutEncounterInput[]
    createMany?: DiagnosisCreateManyEncounterInputEnvelope
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
  }

  export type ProcedureUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput> | ProcedureCreateWithoutEncounterInput[] | ProcedureUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ProcedureCreateOrConnectWithoutEncounterInput | ProcedureCreateOrConnectWithoutEncounterInput[]
    createMany?: ProcedureCreateManyEncounterInputEnvelope
    connect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
  }

  export type PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput = {
    create?: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput> | PreBillAnalysisCreateWithoutEncounterInput[] | PreBillAnalysisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutEncounterInput | PreBillAnalysisCreateOrConnectWithoutEncounterInput[]
    createMany?: PreBillAnalysisCreateManyEncounterInputEnvelope
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
  }

  export type PatientUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    upsert?: PatientUpsertWithoutEncountersInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutEncountersInput, PatientUpdateWithoutEncountersInput>, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type CaseUpdateOneWithoutEncountersNestedInput = {
    create?: XOR<CaseCreateWithoutEncountersInput, CaseUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: CaseCreateOrConnectWithoutEncountersInput
    upsert?: CaseUpsertWithoutEncountersInput
    disconnect?: CaseWhereInput | boolean
    delete?: CaseWhereInput | boolean
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutEncountersInput, CaseUpdateWithoutEncountersInput>, CaseUncheckedUpdateWithoutEncountersInput>
  }

  export type DiagnosisUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput> | DiagnosisCreateWithoutEncounterInput[] | DiagnosisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEncounterInput | DiagnosisCreateOrConnectWithoutEncounterInput[]
    upsert?: DiagnosisUpsertWithWhereUniqueWithoutEncounterInput | DiagnosisUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: DiagnosisCreateManyEncounterInputEnvelope
    set?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    disconnect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    delete?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    update?: DiagnosisUpdateWithWhereUniqueWithoutEncounterInput | DiagnosisUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: DiagnosisUpdateManyWithWhereWithoutEncounterInput | DiagnosisUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
  }

  export type ProcedureUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput> | ProcedureCreateWithoutEncounterInput[] | ProcedureUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ProcedureCreateOrConnectWithoutEncounterInput | ProcedureCreateOrConnectWithoutEncounterInput[]
    upsert?: ProcedureUpsertWithWhereUniqueWithoutEncounterInput | ProcedureUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ProcedureCreateManyEncounterInputEnvelope
    set?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    disconnect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    delete?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    connect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    update?: ProcedureUpdateWithWhereUniqueWithoutEncounterInput | ProcedureUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ProcedureUpdateManyWithWhereWithoutEncounterInput | ProcedureUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ProcedureScalarWhereInput | ProcedureScalarWhereInput[]
  }

  export type PreBillAnalysisUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput> | PreBillAnalysisCreateWithoutEncounterInput[] | PreBillAnalysisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutEncounterInput | PreBillAnalysisCreateOrConnectWithoutEncounterInput[]
    upsert?: PreBillAnalysisUpsertWithWhereUniqueWithoutEncounterInput | PreBillAnalysisUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: PreBillAnalysisCreateManyEncounterInputEnvelope
    set?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    disconnect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    delete?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    update?: PreBillAnalysisUpdateWithWhereUniqueWithoutEncounterInput | PreBillAnalysisUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: PreBillAnalysisUpdateManyWithWhereWithoutEncounterInput | PreBillAnalysisUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
  }

  export type DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput> | DiagnosisCreateWithoutEncounterInput[] | DiagnosisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: DiagnosisCreateOrConnectWithoutEncounterInput | DiagnosisCreateOrConnectWithoutEncounterInput[]
    upsert?: DiagnosisUpsertWithWhereUniqueWithoutEncounterInput | DiagnosisUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: DiagnosisCreateManyEncounterInputEnvelope
    set?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    disconnect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    delete?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    connect?: DiagnosisWhereUniqueInput | DiagnosisWhereUniqueInput[]
    update?: DiagnosisUpdateWithWhereUniqueWithoutEncounterInput | DiagnosisUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: DiagnosisUpdateManyWithWhereWithoutEncounterInput | DiagnosisUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
  }

  export type ProcedureUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput> | ProcedureCreateWithoutEncounterInput[] | ProcedureUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: ProcedureCreateOrConnectWithoutEncounterInput | ProcedureCreateOrConnectWithoutEncounterInput[]
    upsert?: ProcedureUpsertWithWhereUniqueWithoutEncounterInput | ProcedureUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: ProcedureCreateManyEncounterInputEnvelope
    set?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    disconnect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    delete?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    connect?: ProcedureWhereUniqueInput | ProcedureWhereUniqueInput[]
    update?: ProcedureUpdateWithWhereUniqueWithoutEncounterInput | ProcedureUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: ProcedureUpdateManyWithWhereWithoutEncounterInput | ProcedureUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: ProcedureScalarWhereInput | ProcedureScalarWhereInput[]
  }

  export type PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput = {
    create?: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput> | PreBillAnalysisCreateWithoutEncounterInput[] | PreBillAnalysisUncheckedCreateWithoutEncounterInput[]
    connectOrCreate?: PreBillAnalysisCreateOrConnectWithoutEncounterInput | PreBillAnalysisCreateOrConnectWithoutEncounterInput[]
    upsert?: PreBillAnalysisUpsertWithWhereUniqueWithoutEncounterInput | PreBillAnalysisUpsertWithWhereUniqueWithoutEncounterInput[]
    createMany?: PreBillAnalysisCreateManyEncounterInputEnvelope
    set?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    disconnect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    delete?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    connect?: PreBillAnalysisWhereUniqueInput | PreBillAnalysisWhereUniqueInput[]
    update?: PreBillAnalysisUpdateWithWhereUniqueWithoutEncounterInput | PreBillAnalysisUpdateWithWhereUniqueWithoutEncounterInput[]
    updateMany?: PreBillAnalysisUpdateManyWithWhereWithoutEncounterInput | PreBillAnalysisUpdateManyWithWhereWithoutEncounterInput[]
    deleteMany?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
  }

  export type EncounterCreateNestedOneWithoutDiagnosesInput = {
    create?: XOR<EncounterCreateWithoutDiagnosesInput, EncounterUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutDiagnosesInput
    connect?: EncounterWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EncounterUpdateOneRequiredWithoutDiagnosesNestedInput = {
    create?: XOR<EncounterCreateWithoutDiagnosesInput, EncounterUncheckedCreateWithoutDiagnosesInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutDiagnosesInput
    upsert?: EncounterUpsertWithoutDiagnosesInput
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutDiagnosesInput, EncounterUpdateWithoutDiagnosesInput>, EncounterUncheckedUpdateWithoutDiagnosesInput>
  }

  export type EncounterCreateNestedOneWithoutProceduresInput = {
    create?: XOR<EncounterCreateWithoutProceduresInput, EncounterUncheckedCreateWithoutProceduresInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutProceduresInput
    connect?: EncounterWhereUniqueInput
  }

  export type EncounterUpdateOneRequiredWithoutProceduresNestedInput = {
    create?: XOR<EncounterCreateWithoutProceduresInput, EncounterUncheckedCreateWithoutProceduresInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutProceduresInput
    upsert?: EncounterUpsertWithoutProceduresInput
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutProceduresInput, EncounterUpdateWithoutProceduresInput>, EncounterUncheckedUpdateWithoutProceduresInput>
  }

  export type EncounterCreateNestedOneWithoutPreBillAnalysesInput = {
    create?: XOR<EncounterCreateWithoutPreBillAnalysesInput, EncounterUncheckedCreateWithoutPreBillAnalysesInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutPreBillAnalysesInput
    connect?: EncounterWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPreBillAnalysesInput = {
    create?: XOR<UserCreateWithoutPreBillAnalysesInput, UserUncheckedCreateWithoutPreBillAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreBillAnalysesInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EncounterUpdateOneRequiredWithoutPreBillAnalysesNestedInput = {
    create?: XOR<EncounterCreateWithoutPreBillAnalysesInput, EncounterUncheckedCreateWithoutPreBillAnalysesInput>
    connectOrCreate?: EncounterCreateOrConnectWithoutPreBillAnalysesInput
    upsert?: EncounterUpsertWithoutPreBillAnalysesInput
    connect?: EncounterWhereUniqueInput
    update?: XOR<XOR<EncounterUpdateToOneWithWhereWithoutPreBillAnalysesInput, EncounterUpdateWithoutPreBillAnalysesInput>, EncounterUncheckedUpdateWithoutPreBillAnalysesInput>
  }

  export type UserUpdateOneWithoutPreBillAnalysesNestedInput = {
    create?: XOR<UserCreateWithoutPreBillAnalysesInput, UserUncheckedCreateWithoutPreBillAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreBillAnalysesInput
    upsert?: UserUpsertWithoutPreBillAnalysesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPreBillAnalysesInput, UserUpdateWithoutPreBillAnalysesInput>, UserUncheckedUpdateWithoutPreBillAnalysesInput>
  }

  export type CaseCreateNestedOneWithoutDenialsInput = {
    create?: XOR<CaseCreateWithoutDenialsInput, CaseUncheckedCreateWithoutDenialsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutDenialsInput
    connect?: CaseWhereUniqueInput
  }

  export type CaseUpdateOneWithoutDenialsNestedInput = {
    create?: XOR<CaseCreateWithoutDenialsInput, CaseUncheckedCreateWithoutDenialsInput>
    connectOrCreate?: CaseCreateOrConnectWithoutDenialsInput
    upsert?: CaseUpsertWithoutDenialsInput
    disconnect?: CaseWhereInput | boolean
    delete?: CaseWhereInput | boolean
    connect?: CaseWhereUniqueInput
    update?: XOR<XOR<CaseUpdateToOneWithWhereWithoutDenialsInput, CaseUpdateWithoutDenialsInput>, CaseUncheckedUpdateWithoutDenialsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type QueryCreateWithoutUserInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueryUncheckedCreateWithoutUserInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueryCreateOrConnectWithoutUserInput = {
    where: QueryWhereUniqueInput
    create: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput>
  }

  export type QueryCreateManyUserInputEnvelope = {
    data: QueryCreateManyUserInput | QueryCreateManyUserInput[]
  }

  export type CaseCreateWithoutAssignedUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    encounters?: EncounterCreateNestedManyWithoutCaseInput
    denials?: DenialCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutAssignedUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    encounters?: EncounterUncheckedCreateNestedManyWithoutCaseInput
    denials?: DenialUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutAssignedUserInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput>
  }

  export type CaseCreateManyAssignedUserInputEnvelope = {
    data: CaseCreateManyAssignedUserInput | CaseCreateManyAssignedUserInput[]
  }

  export type PreBillAnalysisCreateWithoutUserInput = {
    id?: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
    encounter: EncounterCreateNestedOneWithoutPreBillAnalysesInput
  }

  export type PreBillAnalysisUncheckedCreateWithoutUserInput = {
    id?: string
    encounterId: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type PreBillAnalysisCreateOrConnectWithoutUserInput = {
    where: PreBillAnalysisWhereUniqueInput
    create: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput>
  }

  export type PreBillAnalysisCreateManyUserInputEnvelope = {
    data: PreBillAnalysisCreateManyUserInput | PreBillAnalysisCreateManyUserInput[]
  }

  export type QueryUpsertWithWhereUniqueWithoutUserInput = {
    where: QueryWhereUniqueInput
    update: XOR<QueryUpdateWithoutUserInput, QueryUncheckedUpdateWithoutUserInput>
    create: XOR<QueryCreateWithoutUserInput, QueryUncheckedCreateWithoutUserInput>
  }

  export type QueryUpdateWithWhereUniqueWithoutUserInput = {
    where: QueryWhereUniqueInput
    data: XOR<QueryUpdateWithoutUserInput, QueryUncheckedUpdateWithoutUserInput>
  }

  export type QueryUpdateManyWithWhereWithoutUserInput = {
    where: QueryScalarWhereInput
    data: XOR<QueryUpdateManyMutationInput, QueryUncheckedUpdateManyWithoutUserInput>
  }

  export type QueryScalarWhereInput = {
    AND?: QueryScalarWhereInput | QueryScalarWhereInput[]
    OR?: QueryScalarWhereInput[]
    NOT?: QueryScalarWhereInput | QueryScalarWhereInput[]
    id?: StringFilter<"Query"> | string
    question?: StringFilter<"Query"> | string
    answer?: StringNullableFilter<"Query"> | string | null
    confidence?: FloatNullableFilter<"Query"> | number | null
    sources?: StringNullableFilter<"Query"> | string | null
    status?: StringFilter<"Query"> | string
    context?: StringNullableFilter<"Query"> | string | null
    userId?: StringFilter<"Query"> | string
    createdAt?: DateTimeFilter<"Query"> | Date | string
    updatedAt?: DateTimeFilter<"Query"> | Date | string
  }

  export type CaseUpsertWithWhereUniqueWithoutAssignedUserInput = {
    where: CaseWhereUniqueInput
    update: XOR<CaseUpdateWithoutAssignedUserInput, CaseUncheckedUpdateWithoutAssignedUserInput>
    create: XOR<CaseCreateWithoutAssignedUserInput, CaseUncheckedCreateWithoutAssignedUserInput>
  }

  export type CaseUpdateWithWhereUniqueWithoutAssignedUserInput = {
    where: CaseWhereUniqueInput
    data: XOR<CaseUpdateWithoutAssignedUserInput, CaseUncheckedUpdateWithoutAssignedUserInput>
  }

  export type CaseUpdateManyWithWhereWithoutAssignedUserInput = {
    where: CaseScalarWhereInput
    data: XOR<CaseUpdateManyMutationInput, CaseUncheckedUpdateManyWithoutAssignedUserInput>
  }

  export type CaseScalarWhereInput = {
    AND?: CaseScalarWhereInput | CaseScalarWhereInput[]
    OR?: CaseScalarWhereInput[]
    NOT?: CaseScalarWhereInput | CaseScalarWhereInput[]
    id?: StringFilter<"Case"> | string
    title?: StringFilter<"Case"> | string
    description?: StringNullableFilter<"Case"> | string | null
    status?: StringFilter<"Case"> | string
    priority?: StringFilter<"Case"> | string
    assignedUserId?: StringNullableFilter<"Case"> | string | null
    createdAt?: DateTimeFilter<"Case"> | Date | string
    updatedAt?: DateTimeFilter<"Case"> | Date | string
    patientFhirId?: StringNullableFilter<"Case"> | string | null
    encounterFhirId?: StringNullableFilter<"Case"> | string | null
    medicalRecordNumber?: StringNullableFilter<"Case"> | string | null
    patientName?: StringNullableFilter<"Case"> | string | null
    age?: IntNullableFilter<"Case"> | number | null
    gender?: StringNullableFilter<"Case"> | string | null
    admissionDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    primaryDiagnosis?: StringNullableFilter<"Case"> | string | null
    currentDRG?: StringNullableFilter<"Case"> | string | null
    openDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    closeDate?: DateTimeNullableFilter<"Case"> | Date | string | null
    facilityId?: StringNullableFilter<"Case"> | string | null
  }

  export type PreBillAnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: PreBillAnalysisWhereUniqueInput
    update: XOR<PreBillAnalysisUpdateWithoutUserInput, PreBillAnalysisUncheckedUpdateWithoutUserInput>
    create: XOR<PreBillAnalysisCreateWithoutUserInput, PreBillAnalysisUncheckedCreateWithoutUserInput>
  }

  export type PreBillAnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: PreBillAnalysisWhereUniqueInput
    data: XOR<PreBillAnalysisUpdateWithoutUserInput, PreBillAnalysisUncheckedUpdateWithoutUserInput>
  }

  export type PreBillAnalysisUpdateManyWithWhereWithoutUserInput = {
    where: PreBillAnalysisScalarWhereInput
    data: XOR<PreBillAnalysisUpdateManyMutationInput, PreBillAnalysisUncheckedUpdateManyWithoutUserInput>
  }

  export type PreBillAnalysisScalarWhereInput = {
    AND?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
    OR?: PreBillAnalysisScalarWhereInput[]
    NOT?: PreBillAnalysisScalarWhereInput | PreBillAnalysisScalarWhereInput[]
    id?: StringFilter<"PreBillAnalysis"> | string
    encounterId?: StringFilter<"PreBillAnalysis"> | string
    confidence?: FloatFilter<"PreBillAnalysis"> | number
    recommendations?: StringFilter<"PreBillAnalysis"> | string
    riskFactors?: StringNullableFilter<"PreBillAnalysis"> | string | null
    notes?: StringNullableFilter<"PreBillAnalysis"> | string | null
    status?: StringFilter<"PreBillAnalysis"> | string
    userId?: StringNullableFilter<"PreBillAnalysis"> | string | null
    createdAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"PreBillAnalysis"> | Date | string
    potentialFinancialImpact?: FloatNullableFilter<"PreBillAnalysis"> | number | null
    description?: StringNullableFilter<"PreBillAnalysis"> | string | null
    evidenceId?: StringNullableFilter<"PreBillAnalysis"> | string | null
    embedding?: StringNullableFilter<"PreBillAnalysis"> | string | null
  }

  export type UserCreateWithoutQueriesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    assignedCases?: CaseCreateNestedManyWithoutAssignedUserInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutQueriesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    assignedCases?: CaseUncheckedCreateNestedManyWithoutAssignedUserInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutQueriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQueriesInput, UserUncheckedCreateWithoutQueriesInput>
  }

  export type UserUpsertWithoutQueriesInput = {
    update: XOR<UserUpdateWithoutQueriesInput, UserUncheckedUpdateWithoutQueriesInput>
    create: XOR<UserCreateWithoutQueriesInput, UserUncheckedCreateWithoutQueriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQueriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQueriesInput, UserUncheckedUpdateWithoutQueriesInput>
  }

  export type UserUpdateWithoutQueriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    assignedCases?: CaseUpdateManyWithoutAssignedUserNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutQueriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    assignedCases?: CaseUncheckedUpdateManyWithoutAssignedUserNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAssignedCasesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryCreateNestedManyWithoutUserInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssignedCasesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryUncheckedCreateNestedManyWithoutUserInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssignedCasesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignedCasesInput, UserUncheckedCreateWithoutAssignedCasesInput>
  }

  export type EncounterCreateWithoutCaseInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    diagnoses?: DiagnosisCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutCaseInput = {
    id?: string
    patientId: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureUncheckedCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutCaseInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput>
  }

  export type EncounterCreateManyCaseInputEnvelope = {
    data: EncounterCreateManyCaseInput | EncounterCreateManyCaseInput[]
  }

  export type DenialCreateWithoutCaseInput = {
    id?: string
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
  }

  export type DenialUncheckedCreateWithoutCaseInput = {
    id?: string
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
  }

  export type DenialCreateOrConnectWithoutCaseInput = {
    where: DenialWhereUniqueInput
    create: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput>
  }

  export type DenialCreateManyCaseInputEnvelope = {
    data: DenialCreateManyCaseInput | DenialCreateManyCaseInput[]
  }

  export type UserUpsertWithoutAssignedCasesInput = {
    update: XOR<UserUpdateWithoutAssignedCasesInput, UserUncheckedUpdateWithoutAssignedCasesInput>
    create: XOR<UserCreateWithoutAssignedCasesInput, UserUncheckedCreateWithoutAssignedCasesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssignedCasesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssignedCasesInput, UserUncheckedUpdateWithoutAssignedCasesInput>
  }

  export type UserUpdateWithoutAssignedCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUpdateManyWithoutUserNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignedCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUncheckedUpdateManyWithoutUserNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EncounterUpsertWithWhereUniqueWithoutCaseInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutCaseInput, EncounterUncheckedUpdateWithoutCaseInput>
    create: XOR<EncounterCreateWithoutCaseInput, EncounterUncheckedCreateWithoutCaseInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutCaseInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutCaseInput, EncounterUncheckedUpdateWithoutCaseInput>
  }

  export type EncounterUpdateManyWithWhereWithoutCaseInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutCaseInput>
  }

  export type EncounterScalarWhereInput = {
    AND?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    OR?: EncounterScalarWhereInput[]
    NOT?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    caseId?: StringNullableFilter<"Encounter"> | string | null
    encounterId?: StringFilter<"Encounter"> | string
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    admissionDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    dischargeDate?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    status?: StringFilter<"Encounter"> | string
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
  }

  export type DenialUpsertWithWhereUniqueWithoutCaseInput = {
    where: DenialWhereUniqueInput
    update: XOR<DenialUpdateWithoutCaseInput, DenialUncheckedUpdateWithoutCaseInput>
    create: XOR<DenialCreateWithoutCaseInput, DenialUncheckedCreateWithoutCaseInput>
  }

  export type DenialUpdateWithWhereUniqueWithoutCaseInput = {
    where: DenialWhereUniqueInput
    data: XOR<DenialUpdateWithoutCaseInput, DenialUncheckedUpdateWithoutCaseInput>
  }

  export type DenialUpdateManyWithWhereWithoutCaseInput = {
    where: DenialScalarWhereInput
    data: XOR<DenialUpdateManyMutationInput, DenialUncheckedUpdateManyWithoutCaseInput>
  }

  export type DenialScalarWhereInput = {
    AND?: DenialScalarWhereInput | DenialScalarWhereInput[]
    OR?: DenialScalarWhereInput[]
    NOT?: DenialScalarWhereInput | DenialScalarWhereInput[]
    id?: StringFilter<"Denial"> | string
    caseId?: StringNullableFilter<"Denial"> | string | null
    denialReason?: StringFilter<"Denial"> | string
    amount?: FloatFilter<"Denial"> | number
    status?: StringFilter<"Denial"> | string
    appealDate?: DateTimeNullableFilter<"Denial"> | Date | string | null
    resolution?: StringNullableFilter<"Denial"> | string | null
    createdAt?: DateTimeFilter<"Denial"> | Date | string
    updatedAt?: DateTimeFilter<"Denial"> | Date | string
    denialReasonCode?: StringNullableFilter<"Denial"> | string | null
    deniedAmount?: FloatNullableFilter<"Denial"> | number | null
    appealLetterDraft?: StringNullableFilter<"Denial"> | string | null
    claimFhirId?: StringNullableFilter<"Denial"> | string | null
  }

  export type EncounterCreateWithoutPatientInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    case?: CaseCreateNestedOneWithoutEncountersInput
    diagnoses?: DiagnosisCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutPatientInput = {
    id?: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureUncheckedCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterCreateManyPatientInputEnvelope = {
    data: EncounterCreateManyPatientInput | EncounterCreateManyPatientInput[]
  }

  export type EncounterUpsertWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
  }

  export type EncounterUpdateManyWithWhereWithoutPatientInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientCreateWithoutEncountersInput = {
    id?: string
    name: string
    mrn: string
    dob?: Date | string | null
    gender?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUncheckedCreateWithoutEncountersInput = {
    id?: string
    name: string
    mrn: string
    dob?: Date | string | null
    gender?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientCreateOrConnectWithoutEncountersInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
  }

  export type CaseCreateWithoutEncountersInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    assignedUser?: UserCreateNestedOneWithoutAssignedCasesInput
    denials?: DenialCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutEncountersInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    assignedUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    denials?: DenialUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutEncountersInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutEncountersInput, CaseUncheckedCreateWithoutEncountersInput>
  }

  export type DiagnosisCreateWithoutEncounterInput = {
    id?: string
    icdCode: string
    description: string
    isPrimary?: boolean
  }

  export type DiagnosisUncheckedCreateWithoutEncounterInput = {
    id?: string
    icdCode: string
    description: string
    isPrimary?: boolean
  }

  export type DiagnosisCreateOrConnectWithoutEncounterInput = {
    where: DiagnosisWhereUniqueInput
    create: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput>
  }

  export type DiagnosisCreateManyEncounterInputEnvelope = {
    data: DiagnosisCreateManyEncounterInput | DiagnosisCreateManyEncounterInput[]
  }

  export type ProcedureCreateWithoutEncounterInput = {
    id?: string
    cptCode: string
    description: string
  }

  export type ProcedureUncheckedCreateWithoutEncounterInput = {
    id?: string
    cptCode: string
    description: string
  }

  export type ProcedureCreateOrConnectWithoutEncounterInput = {
    where: ProcedureWhereUniqueInput
    create: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput>
  }

  export type ProcedureCreateManyEncounterInputEnvelope = {
    data: ProcedureCreateManyEncounterInput | ProcedureCreateManyEncounterInput[]
  }

  export type PreBillAnalysisCreateWithoutEncounterInput = {
    id?: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
    user?: UserCreateNestedOneWithoutPreBillAnalysesInput
  }

  export type PreBillAnalysisUncheckedCreateWithoutEncounterInput = {
    id?: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type PreBillAnalysisCreateOrConnectWithoutEncounterInput = {
    where: PreBillAnalysisWhereUniqueInput
    create: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput>
  }

  export type PreBillAnalysisCreateManyEncounterInputEnvelope = {
    data: PreBillAnalysisCreateManyEncounterInput | PreBillAnalysisCreateManyEncounterInput[]
  }

  export type PatientUpsertWithoutEncountersInput = {
    update: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutEncountersInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseUpsertWithoutEncountersInput = {
    update: XOR<CaseUpdateWithoutEncountersInput, CaseUncheckedUpdateWithoutEncountersInput>
    create: XOR<CaseCreateWithoutEncountersInput, CaseUncheckedCreateWithoutEncountersInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutEncountersInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutEncountersInput, CaseUncheckedUpdateWithoutEncountersInput>
  }

  export type CaseUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedUser?: UserUpdateOneWithoutAssignedCasesNestedInput
    denials?: DenialUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    assignedUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    denials?: DenialUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type DiagnosisUpsertWithWhereUniqueWithoutEncounterInput = {
    where: DiagnosisWhereUniqueInput
    update: XOR<DiagnosisUpdateWithoutEncounterInput, DiagnosisUncheckedUpdateWithoutEncounterInput>
    create: XOR<DiagnosisCreateWithoutEncounterInput, DiagnosisUncheckedCreateWithoutEncounterInput>
  }

  export type DiagnosisUpdateWithWhereUniqueWithoutEncounterInput = {
    where: DiagnosisWhereUniqueInput
    data: XOR<DiagnosisUpdateWithoutEncounterInput, DiagnosisUncheckedUpdateWithoutEncounterInput>
  }

  export type DiagnosisUpdateManyWithWhereWithoutEncounterInput = {
    where: DiagnosisScalarWhereInput
    data: XOR<DiagnosisUpdateManyMutationInput, DiagnosisUncheckedUpdateManyWithoutEncounterInput>
  }

  export type DiagnosisScalarWhereInput = {
    AND?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
    OR?: DiagnosisScalarWhereInput[]
    NOT?: DiagnosisScalarWhereInput | DiagnosisScalarWhereInput[]
    id?: StringFilter<"Diagnosis"> | string
    encounterId?: StringFilter<"Diagnosis"> | string
    icdCode?: StringFilter<"Diagnosis"> | string
    description?: StringFilter<"Diagnosis"> | string
    isPrimary?: BoolFilter<"Diagnosis"> | boolean
  }

  export type ProcedureUpsertWithWhereUniqueWithoutEncounterInput = {
    where: ProcedureWhereUniqueInput
    update: XOR<ProcedureUpdateWithoutEncounterInput, ProcedureUncheckedUpdateWithoutEncounterInput>
    create: XOR<ProcedureCreateWithoutEncounterInput, ProcedureUncheckedCreateWithoutEncounterInput>
  }

  export type ProcedureUpdateWithWhereUniqueWithoutEncounterInput = {
    where: ProcedureWhereUniqueInput
    data: XOR<ProcedureUpdateWithoutEncounterInput, ProcedureUncheckedUpdateWithoutEncounterInput>
  }

  export type ProcedureUpdateManyWithWhereWithoutEncounterInput = {
    where: ProcedureScalarWhereInput
    data: XOR<ProcedureUpdateManyMutationInput, ProcedureUncheckedUpdateManyWithoutEncounterInput>
  }

  export type ProcedureScalarWhereInput = {
    AND?: ProcedureScalarWhereInput | ProcedureScalarWhereInput[]
    OR?: ProcedureScalarWhereInput[]
    NOT?: ProcedureScalarWhereInput | ProcedureScalarWhereInput[]
    id?: StringFilter<"Procedure"> | string
    encounterId?: StringFilter<"Procedure"> | string
    cptCode?: StringFilter<"Procedure"> | string
    description?: StringFilter<"Procedure"> | string
  }

  export type PreBillAnalysisUpsertWithWhereUniqueWithoutEncounterInput = {
    where: PreBillAnalysisWhereUniqueInput
    update: XOR<PreBillAnalysisUpdateWithoutEncounterInput, PreBillAnalysisUncheckedUpdateWithoutEncounterInput>
    create: XOR<PreBillAnalysisCreateWithoutEncounterInput, PreBillAnalysisUncheckedCreateWithoutEncounterInput>
  }

  export type PreBillAnalysisUpdateWithWhereUniqueWithoutEncounterInput = {
    where: PreBillAnalysisWhereUniqueInput
    data: XOR<PreBillAnalysisUpdateWithoutEncounterInput, PreBillAnalysisUncheckedUpdateWithoutEncounterInput>
  }

  export type PreBillAnalysisUpdateManyWithWhereWithoutEncounterInput = {
    where: PreBillAnalysisScalarWhereInput
    data: XOR<PreBillAnalysisUpdateManyMutationInput, PreBillAnalysisUncheckedUpdateManyWithoutEncounterInput>
  }

  export type EncounterCreateWithoutDiagnosesInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    case?: CaseCreateNestedOneWithoutEncountersInput
    procedures?: ProcedureCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutDiagnosesInput = {
    id?: string
    patientId: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    procedures?: ProcedureUncheckedCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutDiagnosesInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutDiagnosesInput, EncounterUncheckedCreateWithoutDiagnosesInput>
  }

  export type EncounterUpsertWithoutDiagnosesInput = {
    update: XOR<EncounterUpdateWithoutDiagnosesInput, EncounterUncheckedUpdateWithoutDiagnosesInput>
    create: XOR<EncounterCreateWithoutDiagnosesInput, EncounterUncheckedCreateWithoutDiagnosesInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutDiagnosesInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutDiagnosesInput, EncounterUncheckedUpdateWithoutDiagnosesInput>
  }

  export type EncounterUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    case?: CaseUpdateOneWithoutEncountersNestedInput
    procedures?: ProcedureUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutDiagnosesInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    procedures?: ProcedureUncheckedUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterCreateWithoutProceduresInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    case?: CaseCreateNestedOneWithoutEncountersInput
    diagnoses?: DiagnosisCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutProceduresInput = {
    id?: string
    patientId: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutEncounterInput
    preBillAnalyses?: PreBillAnalysisUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutProceduresInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutProceduresInput, EncounterUncheckedCreateWithoutProceduresInput>
  }

  export type EncounterUpsertWithoutProceduresInput = {
    update: XOR<EncounterUpdateWithoutProceduresInput, EncounterUncheckedUpdateWithoutProceduresInput>
    create: XOR<EncounterCreateWithoutProceduresInput, EncounterUncheckedCreateWithoutProceduresInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutProceduresInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutProceduresInput, EncounterUncheckedUpdateWithoutProceduresInput>
  }

  export type EncounterUpdateWithoutProceduresInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    case?: CaseUpdateOneWithoutEncountersNestedInput
    diagnoses?: DiagnosisUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutProceduresInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterCreateWithoutPreBillAnalysesInput = {
    id?: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
    case?: CaseCreateNestedOneWithoutEncountersInput
    diagnoses?: DiagnosisCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureCreateNestedManyWithoutEncounterInput
  }

  export type EncounterUncheckedCreateWithoutPreBillAnalysesInput = {
    id?: string
    patientId: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    diagnoses?: DiagnosisUncheckedCreateNestedManyWithoutEncounterInput
    procedures?: ProcedureUncheckedCreateNestedManyWithoutEncounterInput
  }

  export type EncounterCreateOrConnectWithoutPreBillAnalysesInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutPreBillAnalysesInput, EncounterUncheckedCreateWithoutPreBillAnalysesInput>
  }

  export type UserCreateWithoutPreBillAnalysesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryCreateNestedManyWithoutUserInput
    assignedCases?: CaseCreateNestedManyWithoutAssignedUserInput
  }

  export type UserUncheckedCreateWithoutPreBillAnalysesInput = {
    id?: string
    name: string
    email: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fullName?: string | null
    userRole?: string | null
    queries?: QueryUncheckedCreateNestedManyWithoutUserInput
    assignedCases?: CaseUncheckedCreateNestedManyWithoutAssignedUserInput
  }

  export type UserCreateOrConnectWithoutPreBillAnalysesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPreBillAnalysesInput, UserUncheckedCreateWithoutPreBillAnalysesInput>
  }

  export type EncounterUpsertWithoutPreBillAnalysesInput = {
    update: XOR<EncounterUpdateWithoutPreBillAnalysesInput, EncounterUncheckedUpdateWithoutPreBillAnalysesInput>
    create: XOR<EncounterCreateWithoutPreBillAnalysesInput, EncounterUncheckedCreateWithoutPreBillAnalysesInput>
    where?: EncounterWhereInput
  }

  export type EncounterUpdateToOneWithWhereWithoutPreBillAnalysesInput = {
    where?: EncounterWhereInput
    data: XOR<EncounterUpdateWithoutPreBillAnalysesInput, EncounterUncheckedUpdateWithoutPreBillAnalysesInput>
  }

  export type EncounterUpdateWithoutPreBillAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    case?: CaseUpdateOneWithoutEncountersNestedInput
    diagnoses?: DiagnosisUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutPreBillAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type UserUpsertWithoutPreBillAnalysesInput = {
    update: XOR<UserUpdateWithoutPreBillAnalysesInput, UserUncheckedUpdateWithoutPreBillAnalysesInput>
    create: XOR<UserCreateWithoutPreBillAnalysesInput, UserUncheckedCreateWithoutPreBillAnalysesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPreBillAnalysesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPreBillAnalysesInput, UserUncheckedUpdateWithoutPreBillAnalysesInput>
  }

  export type UserUpdateWithoutPreBillAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUpdateManyWithoutUserNestedInput
    assignedCases?: CaseUpdateManyWithoutAssignedUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPreBillAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    queries?: QueryUncheckedUpdateManyWithoutUserNestedInput
    assignedCases?: CaseUncheckedUpdateManyWithoutAssignedUserNestedInput
  }

  export type CaseCreateWithoutDenialsInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    assignedUser?: UserCreateNestedOneWithoutAssignedCasesInput
    encounters?: EncounterCreateNestedManyWithoutCaseInput
  }

  export type CaseUncheckedCreateWithoutDenialsInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    assignedUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
    encounters?: EncounterUncheckedCreateNestedManyWithoutCaseInput
  }

  export type CaseCreateOrConnectWithoutDenialsInput = {
    where: CaseWhereUniqueInput
    create: XOR<CaseCreateWithoutDenialsInput, CaseUncheckedCreateWithoutDenialsInput>
  }

  export type CaseUpsertWithoutDenialsInput = {
    update: XOR<CaseUpdateWithoutDenialsInput, CaseUncheckedUpdateWithoutDenialsInput>
    create: XOR<CaseCreateWithoutDenialsInput, CaseUncheckedCreateWithoutDenialsInput>
    where?: CaseWhereInput
  }

  export type CaseUpdateToOneWithWhereWithoutDenialsInput = {
    where?: CaseWhereInput
    data: XOR<CaseUpdateWithoutDenialsInput, CaseUncheckedUpdateWithoutDenialsInput>
  }

  export type CaseUpdateWithoutDenialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedUser?: UserUpdateOneWithoutAssignedCasesNestedInput
    encounters?: EncounterUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutDenialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    assignedUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    encounters?: EncounterUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type QueryCreateManyUserInput = {
    id?: string
    question: string
    answer?: string | null
    confidence?: number | null
    sources?: string | null
    status?: string
    context?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CaseCreateManyAssignedUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    priority?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    patientFhirId?: string | null
    encounterFhirId?: string | null
    medicalRecordNumber?: string | null
    patientName?: string | null
    age?: number | null
    gender?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    primaryDiagnosis?: string | null
    currentDRG?: string | null
    openDate?: Date | string | null
    closeDate?: Date | string | null
    facilityId?: string | null
  }

  export type PreBillAnalysisCreateManyUserInput = {
    id?: string
    encounterId: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type QueryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    sources?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseUpdateWithoutAssignedUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    encounters?: EncounterUpdateManyWithoutCaseNestedInput
    denials?: DenialUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateWithoutAssignedUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    encounters?: EncounterUncheckedUpdateManyWithoutCaseNestedInput
    denials?: DenialUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseUncheckedUpdateManyWithoutAssignedUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterFhirId?: NullableStringFieldUpdateOperationsInput | string | null
    medicalRecordNumber?: NullableStringFieldUpdateOperationsInput | string | null
    patientName?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    primaryDiagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    currentDRG?: NullableStringFieldUpdateOperationsInput | string | null
    openDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PreBillAnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    encounter?: EncounterUpdateOneRequiredWithoutPreBillAnalysesNestedInput
  }

  export type PreBillAnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PreBillAnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EncounterCreateManyCaseInput = {
    id?: string
    patientId: string
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DenialCreateManyCaseInput = {
    id?: string
    denialReason: string
    amount: number
    status?: string
    appealDate?: Date | string | null
    resolution?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    denialReasonCode?: string | null
    deniedAmount?: number | null
    appealLetterDraft?: string | null
    claimFhirId?: string | null
  }

  export type EncounterUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    diagnoses?: DiagnosisUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUncheckedUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DenialUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DenialUncheckedUpdateWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DenialUncheckedUpdateManyWithoutCaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    denialReason?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    appealDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    denialReasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    deniedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    appealLetterDraft?: NullableStringFieldUpdateOperationsInput | string | null
    claimFhirId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EncounterCreateManyPatientInput = {
    id?: string
    caseId?: string | null
    encounterId: string
    chiefComplaint?: string | null
    admissionDate?: Date | string | null
    dischargeDate?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: CaseUpdateOneWithoutEncountersNestedInput
    diagnoses?: DiagnosisUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    diagnoses?: DiagnosisUncheckedUpdateManyWithoutEncounterNestedInput
    procedures?: ProcedureUncheckedUpdateManyWithoutEncounterNestedInput
    preBillAnalyses?: PreBillAnalysisUncheckedUpdateManyWithoutEncounterNestedInput
  }

  export type EncounterUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    caseId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterId?: StringFieldUpdateOperationsInput | string
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    admissionDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dischargeDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisCreateManyEncounterInput = {
    id?: string
    icdCode: string
    description: string
    isPrimary?: boolean
  }

  export type ProcedureCreateManyEncounterInput = {
    id?: string
    cptCode: string
    description: string
  }

  export type PreBillAnalysisCreateManyEncounterInput = {
    id?: string
    confidence: number
    recommendations: string
    riskFactors?: string | null
    notes?: string | null
    status?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    potentialFinancialImpact?: number | null
    description?: string | null
    evidenceId?: string | null
    embedding?: string | null
  }

  export type DiagnosisUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DiagnosisUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DiagnosisUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    icdCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProcedureUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ProcedureUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type ProcedureUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    cptCode?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type PreBillAnalysisUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutPreBillAnalysesNestedInput
  }

  export type PreBillAnalysisUncheckedUpdateWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PreBillAnalysisUncheckedUpdateManyWithoutEncounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    recommendations?: StringFieldUpdateOperationsInput | string
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    potentialFinancialImpact?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    evidenceId?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}