"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// Definir clases mock para los errores de Prisma para que instanceof funcione
var MockPrismaClientInitializationError = /** @class */ (function (_super) {
    __extends(MockPrismaClientInitializationError, _super);
    function MockPrismaClientInitializationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'PrismaClientInitializationError';
        return _this;
    }
    return MockPrismaClientInitializationError;
}(Error));
var MockPrismaClientKnownRequestError = /** @class */ (function (_super) {
    __extends(MockPrismaClientKnownRequestError, _super);
    function MockPrismaClientKnownRequestError(message, code, meta) {
        var _this = _super.call(this, message) || this;
        _this.name = 'PrismaClientKnownRequestError';
        _this.code = code;
        _this.meta = meta;
        return _this;
    }
    return MockPrismaClientKnownRequestError;
}(Error));
// Mock de PrismaClient
var prismaMock = {
    candidate: {
        create: jest.fn(),
        update: jest.fn()
    }
};
// Mockear la instancia de PrismaClient
jest.mock('@prisma/client', function () { return ({
    PrismaClient: jest.fn(function () { return prismaMock; }),
    Prisma: {
        PrismaClientInitializationError: MockPrismaClientInitializationError,
        PrismaClientKnownRequestError: MockPrismaClientKnownRequestError
    }
}); });
describe('Candidate', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('save', function () {
        // Aquí irán nuestros tests para el método save()
    });
    // Aquí podrían ir tests para otros métodos de la clase Candidate
});
