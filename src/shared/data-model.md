# FlagLeap - Simplified Data Model

### member
- id: PK
- fname: string
- lname: string
- email: string
- hpass: string `// pw hash`

### flag
- id: PK
- live_enabled: boolean/tinyint `// in live mode, is flag enabled?`
- test_enabled: boolean/tinyint `// in test mode, is flag enabled?`
- description: string
- archived: boolean/tinyint `// common for both modes`

### operator (enum)
- '$eq', '$gt', '$gte', '$lte', '$lt', '$in', '$startswith', '$endswith', '$contains', '$divisibleby'

### rule
- id: PK
- flag_id: FK
- live_exists: boolean/tinyint `// in live mode, does rule exist?`
- test_exists: boolean/tinyint `// in test mode, does rule exist?`
- rank: number
- description: string
- negated: boolean/tinyint `// negate operator?`
- operand_type: 'number' | 'string' `// common for both operands`
- lhs_operand_key: string `// trait key, dynamic operand`
- operator: operator (from enum)
- rhs_operand_value: string `// static operand`
- result_value: string
