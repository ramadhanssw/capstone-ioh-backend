"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFile = exports.StoreFile = exports.StorageProvider = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app_1 = require("../app");
dotenv_1.default.config();
var StorageProvider;
(function (StorageProvider) {
    StorageProvider["Local"] = "local";
    StorageProvider["Firebase"] = "firebase";
})(StorageProvider = exports.StorageProvider || (exports.StorageProvider = {}));
async function StoreOnLocal(destinationPath, localPath) {
    if (!fs_1.default.existsSync(localPath)) {
        throw new Error('Local path not exists!');
    }
    const fullDestinationPath = path_1.default.join(__dirname, '../../public/uploads/', destinationPath);
    const directory = path_1.default.dirname(fullDestinationPath);
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory, {
            recursive: true
        });
    }
    return new Promise((resolve, reject) => {
        fs_1.default.copyFile(localPath, fullDestinationPath, err => {
            if (err) {
                reject(err);
            }
            resolve(`/local-repo/${destinationPath}`);
        });
    });
}
async function StoreOnFirebase(destinationPath, localPath) {
    if (!fs_1.default.existsSync(localPath)) {
        throw new Error('Local path not exists!');
    }
    return new Promise(async (resolve, reject) => {
        try {
            const uploadResponse = await app_1.storageRef.upload(localPath, {
                public: true,
                destination: destinationPath,
                metadata: {
                    firebaseStorageDownloadTokens: (0, uuid_1.v4)(),
                }
            });
            return resolve(uploadResponse[0].metadata.mediaLink);
        }
        catch (err) {
            reject(err);
        }
    });
}
async function StoreFile(destinationPath, localPath, storageProvider = StorageProvider.Local) {
    let storedLocation = destinationPath;
    switch (storageProvider) {
        case 'local':
            storedLocation = await StoreOnLocal(storedLocation, localPath);
            break;
        case 'firebase':
            storedLocation = await StoreOnFirebase(storedLocation, localPath);
            break;
        default:
            throw new Error('Storage provider not valid!');
    }
    return storedLocation;
}
exports.StoreFile = StoreFile;
async function RemoveFile(filePath) {
    const [, provider, instance, ...filePathArray] = filePath.split('/');
    const joinedPath = filePathArray.join('/');
    switch (provider) {
        case 'local-repo':
            return new Promise((resolve, reject) => {
                fs_1.default.unlink(path_1.default.join(__dirname, `../../public/uploads/${instance}/${joinedPath}`), err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        default:
            throw new Error('Storage provider not valid!');
    }
}
exports.RemoveFile = RemoveFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2R1bGVzL1N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0RBQTJCO0FBQzNCLDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsK0JBQWtDO0FBQ2xDLGdDQUFvQztBQUVwQyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRWYsSUFBWSxlQUdYO0FBSEQsV0FBWSxlQUFlO0lBQ3pCLGtDQUFhLENBQUE7SUFDYix3Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFHMUI7QUFFRCxLQUFLLFVBQVUsWUFBWSxDQUFDLGVBQXVCLEVBQUUsU0FBaUI7SUFDcEUsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0tBQzFDO0lBRUQsTUFBTSxtQkFBbUIsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxlQUFlLENBQUMsQ0FBQTtJQUMxRixNQUFNLFNBQVMsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFFbkQsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDN0IsWUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFBO0tBQ0g7SUFFRCxPQUFPLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzdDLFlBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2hELElBQUksR0FBRyxFQUFFO2dCQUNQLE1BQU0sQ0FBQyxHQUFHLENB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