import { Sequelize, DataTypes as DTypes } from 'sequelize'
import { sqlduck } from 'monoduck'
import { config } from './config'
import {
  zMember, defaultMemberRow,
  zFlag, defaultFlagRow,
  zRule, defaultRuleRow
} from '../shared/z-models'

// Prep: -----------------------------------------------------------------------
const sequelize = new Sequelize(config.DATABASE_URL)
const modelFactory = sqlduck.modelFactory({ sequelize, DTypes })

// Define: ---------------------------------------------------------------------
const memberModel = modelFactory.defineModel({
  tableName: 'member',
  zRowSchema: zMember,
  defaultRow: defaultMemberRow
})

const flagModel = modelFactory.defineModel({
  tableName: 'flag',
  zRowSchema: zFlag,
  defaultRow: defaultFlagRow
})

const ruleModel = modelFactory.defineModel({
  tableName: 'rule',
  zRowSchema: zRule,
  defaultRow: defaultRuleRow
})

// Export: ---------------------------------------------------------------------
export const models = {
  member: memberModel,
  flag: flagModel,
  rule: ruleModel,
  autoMigrate: modelFactory.autoMigrate
}
